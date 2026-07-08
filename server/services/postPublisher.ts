import Account from "../models/Account.js";
import Post from "../models/Post.js";
import zernio from "../config/zernio.js";
import { recordActivity } from "../utils/activity.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

type PlatformId = "instagram" | "facebook" | "linkedin" | "twitter" | "youtube";
type PublishTrigger = "manual" | "scheduled";

const getScheduledAt = (post: any) => new Date(`${post.scheduledDate}T${post.scheduledTime}`);

const isDue = (post: any, now = new Date()) => {
  const scheduledAt = getScheduledAt(post);
  return Number.isFinite(scheduledAt.getTime()) && scheduledAt.getTime() <= now.getTime();
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.data?.message ||
  error?.data?.error ||
  error?.message ||
  "Publishing failed";

const getZernioPostId = (response: any) =>
  response?.data?.post?._id ||
  response?.data?.post?.id ||
  response?.post?._id ||
  response?.post?.id ||
  response?.data?._id ||
  response?.data?.id ||
  "";

const buildPlatformSpecificData = (platform: PlatformId, location: string) => {
  if (!location || !["instagram", "facebook"].includes(platform)) {
    return undefined;
  }

  return {
    location,
    locationName: location,
  };
};

const publishToZernio = async (post: any) => {
  if (!process.env.ZERNIO_API_KEY) {
    throw new Error("ZERNIO_API_KEY is missing. Add it to server/.env to publish to real social accounts.");
  }

  const accounts = await Account.find({
    user: post.user,
    platform: { $in: post.platforms },
    status: "connected",
    zernioAccountId: { $exists: true, $ne: "" },
  });

  const location = post.location?.trim() ?? "";
  const targets = post.platforms.map((platform: PlatformId) => {
    const account = accounts.find((currentAccount) => currentAccount.platform === platform);

    if (!account) {
      throw new Error(`No connected ${platform} account with a Zernio account ID was found.`);
    }

    const platformSpecificData = buildPlatformSpecificData(platform, location);

    return {
      platform,
      accountId: account.zernioAccountId,
      ...(platformSpecificData ? { platformSpecificData } : {}),
    };
  });

  if (post.mediaUrl?.startsWith("blob:")) {
    throw new Error("Media must be uploaded before publishing. Please reselect the media and save the post again.");
  }

  const mediaItems = post.mediaUrl
    ? [{
      type: post.mediaType ?? "image",
      url: post.mediaUrl,
      filename: post.mediaName,
    }]
    : undefined;

  return (zernio as any).posts.createPost({
    body: {
      content: post.content,
      platforms: targets,
      publishNow: true,
      ...(location ? { location } : {}),
      mediaItems,
      metadata: {
        socioraPostId: post._id.toString(),
        trigger: "sociora-scheduler",
        ...(location ? { location } : {}),
      },
    },
  });
};

export const publishPostNow = async (postId: string, userId: string, trigger: PublishTrigger = "manual") => {
  const lockedPost = await Post.findOneAndUpdate(
    {
      _id: postId,
      user: userId,
      status: { $in: ["scheduled", "failed", "draft"] },
    },
    {
      $set: {
        status: "publishing",
        publishAttemptedAt: new Date(),
        publishError: "",
      },
    },
    { new: true, runValidators: true },
  );

  if (!lockedPost) {
    return null;
  }

  try {
    const response = await publishToZernio(lockedPost);
    const publishedPost = await Post.findByIdAndUpdate(
      lockedPost._id,
      {
        $set: {
          status: "published",
          publishedAt: new Date(),
          publishError: "",
          zernioPostId: getZernioPostId(response),
          zernioResponse: response?.data ?? response ?? {},
        },
      },
      { new: true, runValidators: true },
    );

    await recordActivity({
      user: userId,
      type: "published",
      title: trigger === "scheduled" ? "Scheduled post published" : "Post published",
      description: trigger === "scheduled"
        ? "A queued post went live automatically at its scheduled time."
        : "A post was published from the scheduler.",
      platform: lockedPost.platforms[0] as PlatformId,
    });

    broadcastWorkspaceChanged(userId, { postId, status: "published", trigger });
    return publishedPost;
  } catch (error) {
    const message = getErrorMessage(error);
    const failedPost = await Post.findByIdAndUpdate(
      lockedPost._id,
      {
        $set: {
          status: "failed",
          publishError: message,
        },
      },
      { new: true, runValidators: true },
    );

    await recordActivity({
      user: userId,
      type: "failed",
      title: "Post failed",
      description: message,
      platform: lockedPost.platforms[0] as PlatformId,
    });

    broadcastWorkspaceChanged(userId, { postId, status: "failed", trigger, message });
    return failedPost;
  }
};

export const publishDuePosts = async () => {
  const candidates = await Post.find({ status: "scheduled" })
    .sort({ scheduledDate: 1, scheduledTime: 1 })
    .limit(50);

  const duePosts = candidates.filter((post) => isDue(post));

  for (const post of duePosts) {
    await publishPostNow(post._id.toString(), post.user.toString(), "scheduled");
  }
};

export const startPostPublisher = () => {
  void publishDuePosts().catch((error) => {
    console.error("[Publisher] Initial run failed:", getErrorMessage(error));
  });

  const interval = setInterval(() => {
    void publishDuePosts().catch((error) => {
      console.error("[Publisher] Scheduled run failed:", getErrorMessage(error));
    });
  }, 10_000);

  return () => clearInterval(interval);
};
