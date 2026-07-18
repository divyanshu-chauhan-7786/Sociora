import { SiFacebook, SiInstagram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import type { Platform, PlatformId } from "../types";

export const FREE_PLATFORM_IDS: PlatformId[] = ["instagram", "linkedin"];

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    shortName: "IG",
    icon: SiInstagram,
    description: "Plan reels, posts, stories, and visual campaigns.",
    colorClass: "text-coral-700",
    bgClass: "bg-coral-50",
    access: "free",
    planLabel: "Free",
  },
  {
    id: "facebook",
    name: "Facebook",
    shortName: "FB",
    icon: SiFacebook,
    description: "Manage page content, announcements, and campaigns.",
    colorClass: "text-teal-700",
    bgClass: "bg-teal-50",
    access: "upcoming",
    planLabel: "Upcoming",
    lockedDescription: "Facebook publishing will unlock with paid plans in Sociora 2.0.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    shortName: "IN",
    icon: LinkedInIcon,
    description: "Publish professional updates to profiles and pages.",
    colorClass: "text-slate-700",
    bgClass: "bg-slate-100",
    access: "free",
    planLabel: "Free",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    shortName: "X",
    icon: SiX,
    description: "Schedule concise posts, launches, and quick thoughts.",
    colorClass: "text-slate-950",
    bgClass: "bg-slate-100",
    access: "upcoming",
    planLabel: "Upcoming",
    lockedDescription: "Twitter / X publishing will unlock with paid plans in Sociora 2.0.",
  },
  {
    id: "youtube",
    name: "YouTube",
    shortName: "YT",
    icon: SiYoutube,
    description: "Promote videos, shorts, and channel updates.",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50",
    access: "upcoming",
    planLabel: "Upcoming",
    lockedDescription: "YouTube publishing will unlock with paid plans in Sociora 2.0.",
  },
];

export const getPlatform = (platformId: Platform["id"]) =>
  PLATFORMS.find((platform) => platform.id === platformId);

export const isPlatformActive = (platformId: PlatformId) =>
  FREE_PLATFORM_IDS.includes(platformId);

export const getActivePlatforms = () =>
  PLATFORMS.filter((platform) => isPlatformActive(platform.id));
