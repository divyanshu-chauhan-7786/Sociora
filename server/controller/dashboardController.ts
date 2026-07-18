import { Request, Response } from "express";
import Account from "../models/Account.js";
import Activity from "../models/Activity.js";
import Generation from "../models/Generation.js";
import Post from "../models/Post.js";
import { presentActivity, presentPost } from "../utils/presenters.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

export const getDashboard = async (req: Request | any, res: Response): Promise<void> => {
  const [posts, accounts, aiDrafts, activities] = await Promise.all([
    Post.find({ user: req.user._id }),
    Account.find({ user: req.user._id }),
    Generation.countDocuments({ user: req.user._id }),
    Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(12),
  ]);

  const now = new Date();

  // Get only the posts that are realistically upcoming
  const upcomingScheduled = posts.filter((post) => {
    if (post.status !== "scheduled") return false;
    const postDate = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
    return postDate.getTime() > now.getTime();
  });

  const scheduled = posts.filter((post) => post.status === "scheduled");
  const failed = posts.filter((post) => post.status === "failed");
  const connectedAccounts = accounts.filter((account) => account.status === "connected").length;
  
  let health = 100;
  if (connectedAccounts === 0) health = 0; // Realistic penalty: can't publish with 0 accounts
  else {
    if (connectedAccounts < 2) health -= 20;
    health -= failed.length * 20;
  }
  health = Math.max(0, Math.min(100, health));

  res.json({
    stats: {
      scheduled: scheduled.length,
      published: posts.filter((post) => post.status === "published").length,
      connectedAccounts,
      drafts: posts.filter((post) => post.status === "draft").length,
      aiDrafts,
      failed: failed.length,
      publishingHealth: health,
    },
    upcomingPosts: upcomingScheduled
      .sort((firstPost, secondPost) =>
        new Date(`${firstPost.scheduledDate}T${firstPost.scheduledTime}`).getTime() -
        new Date(`${secondPost.scheduledDate}T${secondPost.scheduledTime}`).getTime())
      .slice(0, 5) // Show top 5 realistic upcoming posts
      .map(presentPost),
    activities: activities.map(presentActivity),
  });
};

export const clearActivityFeed = async (req: Request | any, res: Response): Promise<void> => {
  await Activity.deleteMany({ user: req.user._id });
  broadcastWorkspaceChanged(req.user._id.toString(), { status: "activity-cleared" });
  res.status(204).send();
};
