import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  brand: "bg-coral-50 text-coral-700",
  success: "bg-teal-50 text-teal-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-coral-50 text-coral-700",
};

export const Badge = ({ className, tone = "neutral", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
      toneClass[tone],
      className,
    )}
    {...props}
  />
);
