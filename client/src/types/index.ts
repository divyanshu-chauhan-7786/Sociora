import type { ElementType } from "react";

export type PlatformId =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "twitter"
  | "youtube";

export type AccountStatus = "connected" | "disconnected" | "syncing";
export type PostStatus = "scheduled" | "published" | "failed" | "draft";
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
  status: AccountStatus;
  audience: string;
  lastSyncedAt: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  platforms: PlatformId[];
  scheduledDate: string;
  scheduledTime: string;
  status: PostStatus;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaType?: "image" | "video";
  source?: "manual" | "ai";
}

export interface ActivityItem {
  id: string;
  type: "published" | "scheduled" | "connected" | "generated";
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
