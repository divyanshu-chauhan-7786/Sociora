import type { ElementType } from "react";

export type PlatformId =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "twitter"
  | "youtube";

export type AccountStatus = "connected" | "disconnected" | "syncing";
export type PostStatus = "scheduled" | "publishing" | "published" | "failed" | "draft";
export type Tone =
  | "Professional"
  | "Casual"
  | "Friendly"
  | "Bold"
  | "Inspirational"
  | "Witty";

export interface Platform {
  id: PlatformId;
  name: string;
  shortName: string;
  icon: ElementType;
  description: string;
  colorClass: string;
  bgClass: string;
}

export interface SocialAccount {
  id: string;
  platform: PlatformId;
  handle: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
  status: AccountStatus;
  audience: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  zernioAccountId: string;
  analytics?: {
    followersLastUpdated?: string;
    followerGrowth?: number;
    followerGrowthPercentage?: number;
    hasAnalyticsAccess?: boolean;
  };
  lastSyncedAt: string;
}

export interface PlatformPost {
  id: string;
  platform: PlatformId;
  accountId: string;
  accountName: string;
  content: string;
  mediaUrl: string;
  permalink: string;
  publishedAt: string;
  commentCount: number;
  likeCount: number;
  isAd: boolean;
}

export interface ScheduledPost {
  id: string;
  content: string;
  platforms: PlatformId[];
  scheduledDate: string;
  scheduledTime: string;
  location?: string;
  status: PostStatus;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  publishAttemptedAt?: string;
  publishError?: string;
  zernioPostId?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaType?: "image" | "video";
  source?: "manual" | "ai";
}

export interface ActivityItem {
  id: string;
  type: "published" | "scheduled" | "connected" | "generated" | "failed";
  title: string;
  description: string;
  createdAt: string;
  platform?: PlatformId;
}

export interface Generation {
  id: string;
  prompt: string;
  content: string;
  tone: Tone;
  createdAt: string;
  mediaUrl?: string;
}

export interface NavItem {
  name: string;
  path: string;
  icon: ElementType;
}
