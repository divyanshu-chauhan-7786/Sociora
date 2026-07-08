export const presentUser = (user: any) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role ?? "",
  company: user.company ?? "",
  bio: user.bio ?? "",
  profileImageUrl: user.profileImageUrl ?? "",
});

export const presentAccount = (account: any) => ({
  id: account._id.toString(),
  platform: account.platform,
  handle: account.handle,
  displayName: account.displayName ?? account.handle,
  avatarUrl: account.avatarUrl ?? "",
  profileUrl: account.profileUrl ?? "",
  status: account.status === "error" ? "disconnected" : account.status,
  audience: account.audience ?? "0",
  followerCount: account.followerCount ?? 0,
  followingCount: account.followingCount ?? 0,
  postCount: account.postCount ?? 0,
  zernioAccountId: account.zernioAccountId ?? "",
  analytics: {
    followersLastUpdated: account.zernioMetadata?.followersLastUpdated ?? "",
    followerGrowth: account.zernioMetadata?.followerGrowth ?? 0,
    followerGrowthPercentage: account.zernioMetadata?.followerGrowthPercentage ?? 0,
    hasAnalyticsAccess: Boolean(account.zernioMetadata?.hasAnalyticsAccess),
  },
  lastSyncedAt: (account.updatedAt ?? account.createdAt ?? new Date()).toISOString(),
});

export const presentPost = (post: any) => ({
  id: post._id.toString(),
  content: post.content,
  platforms: post.platforms,
  scheduledDate: post.scheduledDate,
  scheduledTime: post.scheduledTime,
  location: post.location ?? "",
  status: post.status,
  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt?.toISOString(),
  publishedAt: post.publishedAt?.toISOString(),
  publishAttemptedAt: post.publishAttemptedAt?.toISOString(),
  publishError: post.publishError,
  zernioPostId: post.zernioPostId,
  mediaUrl: post.mediaUrl,
  mediaName: post.mediaName,
  mediaType: post.mediaType,
  source: post.source,
});

export const presentGeneration = (generation: any) => ({
  id: generation._id.toString(),
  prompt: generation.prompt,
  content: generation.content,
  tone: generation.tone,
  createdAt: generation.createdAt.toISOString(),
  mediaUrl: generation.mediaUrl,
});

export const presentActivity = (activity: any) => ({
  id: activity._id.toString(),
  type: activity.type,
  title: activity.title,
  description: activity.description,
  createdAt: activity.createdAt.toISOString(),
  platform: activity.platform,
});
