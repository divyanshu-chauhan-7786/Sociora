import { SiFacebook, SiInstagram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import type { Platform, PlatformId } from "../types";

export const FREE_PLATFORM_IDS: PlatformId[] = ["instagram", "linkedin", "facebook", "twitter", "youtube"];

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    shortName: "IG",
    icon: SiInstagram,
    description: "Plan reels, posts, stories, and visual campaigns via Zernio OAuth.",
    colorClass: "text-coral-700",
    bgClass: "bg-coral-50",
    access: "free",
    planLabel: "Active",
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
    planLabel: "Active",
  },
  {
    id: "facebook",
    name: "Facebook",
    shortName: "FB",
    icon: SiFacebook,
    description: "Manage page content, announcements, and campaigns.",
    colorClass: "text-teal-700",
    bgClass: "bg-teal-50",
    access: "free",
    planLabel: "Active",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    shortName: "X",
    icon: SiX,
    description: "Schedule concise posts, launches, and quick thoughts.",
    colorClass: "text-slate-950",
    bgClass: "bg-slate-100",
    access: "free",
    planLabel: "Active",
  },
  {
    id: "youtube",
    name: "YouTube",
    shortName: "YT",
    icon: SiYoutube,
    description: "Promote videos, shorts, and channel updates.",
    colorClass: "text-red-700",
    bgClass: "bg-red-50",
    access: "free",
    planLabel: "Active",
  },
];

export const getPlatform = (platformId: Platform["id"]) =>
  PLATFORMS.find((platform) => platform.id === platformId);

export const isPlatformActive = (_platformId: PlatformId) => true;

export const getActivePlatforms = () => PLATFORMS;
