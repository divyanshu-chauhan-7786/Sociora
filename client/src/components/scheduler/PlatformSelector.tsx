import { Check, Lock } from "lucide-react";

import { PLATFORMS, isPlatformActive } from "../../constants/platforms";
import type { PlatformId } from "../../types";
import { cn } from "../../utils/cn";
import { getRealisticIcon } from "../ui/SocialIcons";

interface PlatformSelectorProps {
  value: PlatformId[];
  onChange: (platforms: PlatformId[]) => void;
  availablePlatforms?: PlatformId[];
}

export const PlatformSelector = ({ availablePlatforms, value, onChange }: PlatformSelectorProps) => {
  const togglePlatform = (platformId: PlatformId) => {
    const active = value.includes(platformId);
    const unavailable = !isPlatformActive(platformId) || Boolean(availablePlatforms && !availablePlatforms.includes(platformId));

    if (!active && unavailable) {
      return;
    }

    onChange(
      value.includes(platformId)
        ? value.filter((selected) => selected !== platformId)
        : [...value, platformId],
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        const active = value.includes(platform.id);
        const locked = !isPlatformActive(platform.id);
        const notConnected = Boolean(availablePlatforms && !availablePlatforms.includes(platform.id));
        const unavailable = locked || notConnected;
        const disabled = unavailable && !active;

        return (
          <button
            key={platform.id}
            className={cn(
              "relative flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100",
              unavailable
                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 opacity-70 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-600"
                : active
                ? "border-teal-200 bg-[linear-gradient(135deg,#fff1f2,#f0fdfa)] text-slate-950 shadow-sm dark:border-teal-800 dark:bg-[linear-gradient(135deg,#0f172a,#134e4a)] dark:text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800",
            )}
            disabled={disabled}
            onClick={() => togglePlatform(platform.id)}
            type="button"
          >
            <span className="flex w-full items-center justify-between gap-2">
              {getRealisticIcon(platform.id, "h-5 w-5") || <Icon className="h-5 w-5" />}
              {active && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              {!active && locked && <Lock className="h-4 w-4 text-amber-600" />}
            </span>
            <span className="text-sm font-bold">{platform.shortName}</span>
            {unavailable && (
              <span className="text-[0.68rem] font-bold uppercase tracking-wide">
                {locked ? "Upcoming" : "Connect"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
