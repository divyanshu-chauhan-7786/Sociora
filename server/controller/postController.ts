import { Request, Response } from "express";
import Account from "../models/Account.js";
import Post from "../models/Post.js";
import zernio from "../config/zernio.js";
import { publishPostNow } from "../services/postPublisher.js";
import { presentPost } from "../utils/presenters.js";
import { recordActivity } from "../utils/activity.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

type PlatformId = "instagram" | "facebook" | "linkedin" | "twitter" | "youtube";
type UnpublishablePlatformId = Exclude<PlatformId, "instagram">;

const platformValues: PlatformId[] = ["instagram", "facebook", "linkedin", "twitter", "youtube"];
const unpublishablePlatforms: UnpublishablePlatformId[] = ["facebook", "linkedin", "twitter", "youtube"];

const buildPostPayload = (body: any) => ({
  content: body.content,
  platforms: body.platforms,
  scheduledDate: body.scheduledDate,
  scheduledTime: body.scheduledTime,
  location: body.location?.trim() ?? "",
  status: body.status ?? "scheduled",
  mediaUrl: body.mediaUrl,
  mediaName: body.mediaName,
  mediaType: body.mediaType,
  source: body.source ?? "manual",
});

const ensureConnectedAccounts = async (userId: string, platforms: PlatformId[]) => {
  const accounts = await Account.find({
    user: userId,
    platform: { $in: platforms },
    status: "connected",
  });

  const connectedPlatforms = new Set(accounts.map((account) => account.platform));
  return platforms.filter((platform) => !connectedPlatforms.has(platform));
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.data?.message ||
  error?.data?.error ||
  error?.message ||
  "Post could not be deleted from the selected platform.";

export const listPosts = async (req: Request | any, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = { user: req.user._id };

  if (typeof req.query.status === "string") {
    filter.status = req.query.status;
  }

  const posts = await Post.find(filter).sort({ scheduledDate: 1, scheduledTime: 1, createdAt: -1 });
  res.json(posts.map(presentPost));
};

export const createPost = async (req: Request | any, res: Response): Promise<void> => {
  const missingPlatforms = await ensureConnectedAccounts(req.user._id.toString(), req.body.platforms ?? []);

  if (missingPlatforms.length > 0) {
    res.status(400).json({ message: `Connect ${missingPlatforms.join(", ")} before scheduling this post.` });
    return;
  }

  const post = await Post.create({
    user: req.user._id,
    ...buildPostPayload(req.body),
  });

  await recordActivity({
    user: req.user._id.toString(),
    type: "scheduled",
    title: "Post scheduled",
    description: "A post was added to the publishing queue.",
    platform: post.platforms[0] as PlatformId,
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { postId: post._id.toString(), status: post.status });

  res.status(201).json(presentPost(post));
};

export const updatePost = async (req: Request | any, res: Response): Promise<void> => {
  const missingPlatforms = await ensureConnectedAccounts(req.user._id.toString(), req.body.platforms ?? []);

  if (missingPlatforms.length > 0) {
    res.status(400).json({ message: `Connect ${missingPlatforms.join(", ")} before scheduling this post.` });
    return;
  }

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, status: { $ne: "publishing" } },
    { $set: buildPostPayload(req.body) },
    { new: true, runValidators: true },
  );

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  broadcastWorkspaceChanged(req.user._id.toString(), { postId: post._id.toString(), status: post.status });

  res.json(presentPost(post));
};

export const deletePost = async (req: Request | any, res: Response): Promise<void> => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  broadcastWorkspaceChanged(req.user._id.toString(), { postId: req.params.id, status: "deleted" });

  res.status(204).send();
};

export const unpublishPost = async (req: Request | any, res: Response): Promise<void> => {
  const platforms = Array.isArray(req.body.platforms)
    ? Array.from(new Set(req.body.platforms.map((platform: unknown) => String(platform))))
    : [];

  if (platforms.length === 0) {
    res.status(400).json({ message: "Select at least one platform to delete this published post from." });
    return;
  }

  const invalidPlatforms = platforms.filter((platform) => !platformValues.includes(platform as PlatformId));
  if (invalidPlatforms.length > 0) {
    res.status(400).json({ message: `Unsupported platform: ${invalidPlatforms.join(", ")}` });
    return;
  }

  const requestedPlatforms = platforms as PlatformId[];

  const unsupportedPlatforms = requestedPlatforms.filter((platform) => !unpublishablePlatforms.includes(platform as UnpublishablePlatformId));
  if (unsupportedPlatforms.length > 0) {
    res.status(400).json({ message: `Deleting published posts is not supported for ${unsupportedPlatforms.join(", ")}.` });
    return;
  }

  if (!process.env.ZERNIO_API_KEY) {
    res.status(500).json({ message: "ZERNIO_API_KEY is missing. Add it to server/.env to delete published posts from social platforms." });
    return;
  }

  const post = await Post.findOne({ _id: req.params.id, user: req.user._id });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.status !== "published") {
    res.status(400).json({ message: "Only published posts can be deleted from social platforms." });
    return;
  }

  if (!post.zernioPostId) {
    res.status(400).json({ message: "This post does not have a Zernio post ID, so it cannot be deleted from social platforms." });
    return;
  }

  const unavailablePlatforms = requestedPlatforms.filter((platform) => !post.platforms.includes(platform));
  if (unavailablePlatforms.length > 0) {
    res.status(400).json({ message: `This post is not published on ${unavailablePlatforms.join(", ")}.` });
    return;
  }

  const deletedPlatforms: PlatformId[] = [];
  const failedPlatforms: Array<{ platform: string; message: string }> = [];

  for (const platform of requestedPlatforms as UnpublishablePlatformId[]) {
    try {
      await (zernio as any).posts.unpublishPost({
        path: { postId: post.zernioPostId },
        body: { platform },
      });
      deletedPlatforms.push(platform);
    } catch (error: any) {
      failedPlatforms.push({ platform, message: getErrorMessage(error) });
    }
  }

  if (deletedPlatforms.length === 0) {
    res.status(502).json({
      message: failedPlatforms[0]?.message || "Post could not be deleted from the selected platforms.",
      failures: failedPlatforms,
    });
    return;
  }

  const remainingPlatforms = post.platforms.filter((platform: PlatformId) => !deletedPlatforms.includes(platform));

  if (remainingPlatforms.length === 0) {
    await Post.findByIdAndDelete(post._id);
    broadcastWorkspaceChanged(req.user._id.toString(), {
      postId: post._id.toString(),
      status: "deleted",
      platforms: deletedPlatforms,
    });

    res.json({
      deleted: true,
      deletedPlatforms,
      failures: failedPlatforms,
    });
    return;
  }

  post.platforms = remainingPlatforms;
  await post.save();

  broadcastWorkspaceChanged(req.user._id.toString(), {
    postId: post._id.toString(),
    status: post.status,
    platforms: deletedPlatforms,
  });

  res.json({
    deleted: false,
    deletedPlatforms,
    failures: failedPlatforms,
    post: presentPost(post),
  });
};

export const createMediaUploadUrl = async (req: Request | any, res: Response): Promise<void> => {
  const { filename, contentType } = req.body;

  if (!filename || !contentType) {
    res.status(400).json({ message: "filename and contentType are required" });
    return;
  }

  if (!process.env.ZERNIO_API_KEY) {
    res.status(500).json({ message: "ZERNIO_API_KEY is missing. Add it to server/.env to upload media." });
    return;
  }

  const response = await (zernio as any).media.getMediaPresignedUrl({
    body: { filename, contentType },
  });

  const data = response?.data ?? response;
  const uploadUrl = data?.uploadUrl;
  const publicUrl = data?.publicUrl;

  if (!uploadUrl || !publicUrl) {
    res.status(502).json({ message: "Zernio did not return a media upload URL." });
    return;
  }

  res.json({ uploadUrl, publicUrl });
};

export const publishPost = async (req: Request | any, res: Response): Promise<void> => {
  const post = await publishPostNow(req.params.id, req.user._id.toString(), "manual");

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.json(presentPost(post));
};
