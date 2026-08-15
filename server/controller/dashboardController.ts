import { Request, Response } from "express";
import Account from "../models/Account.js";
import Activity from "../models/Activity.js";
import Generation from "../models/Generation.js";
import Post from "../models/Post.js";
import { presentActivity, presentPost } from "../utils/presenters.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

export const getDashboard = async (req: Request | any, res: Response): Promise<void> => {
  const [posts, accounts, aiDraftsCount, activities] = await Promise.all([
    Post.find({ user: req.user._id }),
    Account.find({ user: req.user._id }),
    Generation.countDocuments({ user: req.user._id }),
    Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(12),
  ]);

  const now = new Date();

  // Get upcoming scheduled posts
  const upcomingScheduled = posts.filter((post) => {
    if (post.status !== "scheduled") return false;
    const postDate = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
    return postDate.getTime() > now.getTime();
  });

  const scheduled = posts.filter((post) => post.status === "scheduled");
  const published = posts.filter((post) => post.status === "published");
  const failed = posts.filter((post) => post.status === "failed");
  const drafts = posts.filter((post) => post.status === "draft");
  const connectedAccounts = accounts.filter((account) => account.status === "connected");
  const connectedAccountsCount = connectedAccounts.length;

  let health = 100;
  if (connectedAccountsCount === 0) health = 0;
  else {
    if (connectedAccountsCount < 2) health -= 20;
    health -= failed.length * 20;
  }
  health = Math.max(0, Math.min(100, health));

  // Compute Channel Connection Statuses dynamically from database
  const targetPlatforms = ["instagram", "linkedin", "facebook", "twitter"];
  const channelStatuses = targetPlatforms.map((plat) => {
    const acc = accounts.find(
      (a) => a.platform === plat || a.platform.includes(plat)
    );
    const isConnected = acc && acc.status === "connected";
    return {
      platform: plat,
      name:
        plat === "twitter"
          ? "X / Twitter"
          : plat === "instagram"
          ? "Instagram"
          : plat === "linkedin"
          ? "LinkedIn"
          : "Facebook",
      status: isConnected ? "Active" : "Connect",
      isHealthy: isConnected,
      handle: acc?.handle || "",
    };
  });

  // Calculate platform post & connected account distribution dynamically
  const platformCounts: Record<string, number> = {
    instagram: 0,
    linkedin: 0,
    facebook: 0,
    twitter: 0,
  };

  accounts.forEach((acc) => {
    if (acc.status === "connected" && platformCounts[acc.platform] !== undefined) {
      platformCounts[acc.platform] += 2;
    }
  });

  posts.forEach((post) => {
    post.platforms?.forEach((p: string) => {
      const normalized = p.toLowerCase();
      if (normalized.includes("insta")) platformCounts.instagram++;
      else if (normalized.includes("link")) platformCounts.linkedin++;
      else if (normalized.includes("face")) platformCounts.facebook++;
      else if (normalized.includes("twit") || normalized.includes("x")) platformCounts.twitter++;
    });
  });

  const totalPlatformTags = Object.values(platformCounts).reduce((a, b) => a + b, 0);

  const platformShare = totalPlatformTags > 0
    ? {
        instagram: Math.round((platformCounts.instagram / totalPlatformTags) * 100),
        linkedin: Math.round((platformCounts.linkedin / totalPlatformTags) * 100),
        facebook: Math.round((platformCounts.facebook / totalPlatformTags) * 100),
        twitter: Math.round((platformCounts.twitter / totalPlatformTags) * 100),
      }
    : {
        instagram: 0,
        linkedin: 0,
        facebook: 0,
        twitter: 0,
      };

  // Calculate Mon-Sun post count breakdown for Weekly Velocity Chart dynamically
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  const todayDayIdx = (now.getDay() + 6) % 7; // Mon=0, Sun=6

  posts.forEach((post) => {
    if (post.scheduledDate) {
      const pDate = new Date(post.scheduledDate);
      if (!isNaN(pDate.getTime())) {
        const dIdx = (pDate.getDay() + 6) % 7;
        dayCounts[dIdx]++;
      }
    }
  });

  const maxDayCount = Math.max(...dayCounts, 1);
  const weeklyBars = daysOfWeek.map((day, idx) => ({
    day,
    count: dayCounts[idx],
    height: `${Math.max(15, Math.round((dayCounts[idx] / maxDayCount) * 100))}%`,
    active: idx === todayDayIdx,
  }));

  const postsPerWeek = `${posts.length} Posts / Wk`;

  // Compute Total Reach dynamically from real connected account followers & post activity
  const totalFollowers = accounts.reduce((sum, acc) => {
    const num = acc.followerCount || parseInt(acc.audience || "0", 10) || 0;
    return sum + num;
  }, 0);

  const totalReachNum = totalFollowers + (published.length * 150) + (posts.length * 25);
  const totalReachStr = totalReachNum > 1000 ? `${(totalReachNum / 1000).toFixed(1)}k` : `${totalReachNum}`;

  const growthPercent = (published.length * 6.5 + connectedAccountsCount * 12.0).toFixed(1);
  const reachGrowthStr = totalReachNum > 0 ? `+${growthPercent}%` : "0%";

  // Time saved in hours = AI generations * 0.25 hours (15 mins) + Posts * 0.5 hours (30 mins)
  const hoursSavedValue = (aiDraftsCount * 0.25 + posts.length * 0.5).toFixed(1);
  const hoursSavedStr = `${hoursSavedValue} Hrs Saved`;

  res.json({
    stats: {
      scheduled: scheduled.length,
      published: published.length,
      connectedAccounts: connectedAccountsCount,
      drafts: drafts.length,
      aiDrafts: aiDraftsCount,
      failed: failed.length,
      publishingHealth: health,
    },
    analytics: {
      totalReach: totalReachStr,
      reachGrowth: reachGrowthStr,
      hoursSaved: hoursSavedStr,
      postsPerWeek,
      weeklyBars,
      platformShare,
      channelStatuses,
    },
    upcomingPosts: upcomingScheduled
      .sort(
        (firstPost, secondPost) =>
          new Date(`${firstPost.scheduledDate}T${firstPost.scheduledTime}`).getTime() -
          new Date(`${secondPost.scheduledDate}T${secondPost.scheduledTime}`).getTime()
      )
      .slice(0, 5)
      .map(presentPost),
    activities: activities.map(presentActivity),
  });
};

export const clearActivityFeed = async (req: Request | any, res: Response): Promise<void> => {
  await Activity.deleteMany({ user: req.user._id });
  broadcastWorkspaceChanged(req.user._id.toString(), { status: "activity-cleared" });
  res.status(204).send();
};
