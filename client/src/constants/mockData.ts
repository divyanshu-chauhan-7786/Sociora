import img1 from "../assets/img-1.jpg";
import img2 from "../assets/img-2.jpg";
import img3 from "../assets/img-3.jpg";
import img4 from "../assets/img-4.jpg";
import type { ActivityItem, Generation, ScheduledPost, SocialAccount } from "../types";

export const mockPosts: ScheduledPost[] = [
  {
    id: "post-001",
    content:
      "Launch week is here. We are rolling out a smarter social workflow for teams that want AI-assisted drafting, cleaner approvals, and calmer publishing queues.",
    platforms: ["linkedin", "twitter"],
    scheduledDate: "2026-06-09",
    scheduledTime: "09:30",
    status: "scheduled",
    createdAt: "2026-06-06T09:30:00.000Z",
    mediaUrl: img1,
    mediaName: "launch-creative.jpg",
    mediaType: "image",
    source: "manual",
  },
  {
    id: "post-002",
    content:
      "A practical reminder for growing brands: consistency beats volume. Plan fewer posts with clearer intent, stronger creative, and a reliable publishing cadence.",
    platforms: ["instagram", "facebook"],
    scheduledDate: "2026-06-10",
    scheduledTime: "16:00",
    status: "scheduled",
    createdAt: "2026-06-06T12:10:00.000Z",
    mediaUrl: img2,
    mediaName: "brand-playbook.jpg",
    mediaType: "image",
    source: "manual",
  },
  {
    id: "post-003",
    content:
      "New AI content workflow: brief once, generate platform-aware variants, and schedule the best version without leaving your dashboard.",
    platforms: ["linkedin"],
    scheduledDate: "2026-06-05",
    scheduledTime: "11:15",
    status: "published",
    createdAt: "2026-06-04T10:00:00.000Z",
    publishedAt: "2026-06-05T11:15:00.000Z",
    mediaUrl: img3,
    mediaName: "workflow.jpg",
    mediaType: "image",
    source: "ai",
  },
  {
    id: "post-004",
    content:
      "Draft idea: turn next week's webinar into a full week of short-form posts, each mapped to a different customer pain point.",
    platforms: ["youtube", "twitter"],
    scheduledDate: "2026-06-12",
    scheduledTime: "18:45",
    status: "draft",
    createdAt: "2026-06-06T15:20:00.000Z",
    source: "manual",
  },
  {
    id: "post-005",
    content:
      "Behind the scenes: how a two-person marketing team can keep a steady publishing rhythm without turning content ops into a second job.",
    platforms: ["instagram"],
    scheduledDate: "2026-06-02",
    scheduledTime: "13:30",
    status: "failed",
    createdAt: "2026-06-01T13:00:00.000Z",
    mediaUrl: img4,
    mediaName: "team-workflow.jpg",
    mediaType: "image",
    source: "manual",
  },
];

export const mockAccounts: SocialAccount[] = [
  {
    id: "account-001",
    platform: "instagram",
    handle: "greatstack",
    displayName: "Greatstack",
    avatarUrl: "",
    profileUrl: "",
    status: "connected",
    audience: "48.2K",
    followerCount: 48200,
    followingCount: 180,
    postCount: 214,
    zernioAccountId: "",
    lastSyncedAt: "2026-06-06T10:12:00.000Z",
  },
  {
    id: "account-002",
    platform: "linkedin",
    handle: "Greatstack",
    displayName: "Greatstack",
    avatarUrl: "",
    profileUrl: "",
    status: "connected",
    audience: "18.7K",
    followerCount: 18700,
    followingCount: 0,
    postCount: 86,
    zernioAccountId: "",
    lastSyncedAt: "2026-06-06T08:45:00.000Z",
  },
  {
    id: "account-003",
    platform: "twitter",
    handle: "greatstackdev",
    displayName: "Greatstack Dev",
    avatarUrl: "",
    profileUrl: "",
    status: "syncing",
    audience: "12.4K",
    followerCount: 12400,
    followingCount: 310,
    postCount: 1270,
    zernioAccountId: "",
    lastSyncedAt: "2026-06-05T18:25:00.000Z",
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "activity-001",
    type: "published",
    title: "Post published",
    description: "AI workflow announcement went live on LinkedIn.",
    platform: "linkedin",
    createdAt: "2026-06-05T11:15:00.000Z",
  },
  {
    id: "activity-002",
    type: "scheduled",
    title: "Post scheduled",
    description: "Launch week post added to the Tuesday queue.",
    platform: "twitter",
    createdAt: "2026-06-06T09:30:00.000Z",
  },
  {
    id: "activity-003",
    type: "generated",
    title: "AI content generated",
    description: "Created three launch angles in a professional tone.",
    createdAt: "2026-06-06T07:40:00.000Z",
  },
  {
    id: "activity-004",
    type: "connected",
    title: "Account connected",
    description: "Twitter / X account synced successfully.",
    platform: "twitter",
    createdAt: "2026-06-05T18:25:00.000Z",
  },
];

export const mockGenerations: Generation[] = [
  {
    id: "generation-001",
    prompt: "Create a launch post for an AI-powered scheduler",
    content:
      "Meet Sociora: a faster, calmer way to plan social content with AI. Draft posts, adapt them for every channel, and keep your publishing queue moving from one clean workspace.",
    tone: "Professional",
    mediaUrl: img1,
    createdAt: "2026-06-06T07:40:00.000Z",
  },
  {
    id: "generation-002",
    prompt: "Write a friendly post about consistency in social media",
    content:
      "You do not need to post everywhere all at once. Start with a clear idea, choose the channels your audience already uses, and build a rhythm your team can actually maintain.",
    tone: "Friendly",
    mediaUrl: img2,
    createdAt: "2026-06-05T15:12:00.000Z",
  },
  {
    id: "generation-003",
    prompt: "Create a bold announcement for a YouTube tutorial",
    content:
      "New tutorial is live. Learn how to turn one strong long-form video into a week of short posts, platform-specific captions, and a queue your team can publish with confidence.",
    tone: "Bold",
    mediaUrl: img3,
    createdAt: "2026-06-04T12:04:00.000Z",
  },
];
