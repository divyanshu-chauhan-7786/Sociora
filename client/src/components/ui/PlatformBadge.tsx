import { getPlatform } from "../../constants/platforms";
import type { PlatformId } from "../../types";
import { cn } from "../../utils/cn";
import { getRealisticIcon } from "./SocialIcons";

interface PlatformBadgeProps {
  platformId: PlatformId;
  compact?: boolean;
}

export const PlatformBadge = ({ platformId, compact = false }: PlatformBadgeProps) => {
  const platform = getPlatform(platformId);

  if (!platform) {
    return null;
  }

  const Icon = platform.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        platform.bgClass,
        platform.colorClass,
      )}
    >
      {getRealisticIcon(platformId, "h-3.5 w-3.5") || <Icon className="h-3.5 w-3.5" />}
      {compact ? platform.shortName : platform.name}
    </span>
  );
};
