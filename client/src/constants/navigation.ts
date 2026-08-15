import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type { NavItem } from "../types";

export const navigationItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Accounts", path: "/accounts", icon: UsersRound },
  { name: "Scheduler", path: "/schedule", icon: CalendarDays },
  { name: "AI Composer", path: "/ai-composer", icon: Sparkles },
  { name: "Inbox & Auto-DM", path: "/inbox", icon: MessageSquare },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const pageMeta: Record<string, { title: string; eyebrow: string }> = {
  "/dashboard": {
    title: "Dashboard",
    eyebrow: "A calm command center for your social workflow.",
  },
  "/accounts": {
    title: "Accounts",
    eyebrow: "Connect channels and monitor publishing readiness.",
  },
  "/schedule": {
    title: "Scheduler",
    eyebrow: "Compose, preview, and manage every queued post.",
  },
  "/ai-composer": {
    title: "AI Composer",
    eyebrow: "Generate polished content and send it straight to the queue.",
  },
  "/inbox": {
    title: "Social Inbox & Auto-DM",
    eyebrow: "Unified inbox, AI quick replies, and keyword auto-DM triggers.",
  },
  "/settings": {
    title: "Settings",
    eyebrow: "Tune workspace preferences, publishing rules, and security.",
  },
};
