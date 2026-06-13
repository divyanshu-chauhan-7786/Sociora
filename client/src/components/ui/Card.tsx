import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/40 transition duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/40",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-5 py-4 dark:border-slate-800 dark:bg-[linear-gradient(135deg,#0f172a,#1e293b)]",
      className,
    )}
    {...props}
  />
);

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-base font-black text-slate-950 dark:text-white", className)} {...props} />
);
