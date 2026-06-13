import { cn } from "../../utils/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-slate-200", className)} />
);

export const CardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="mt-5 h-20 w-full" />
  </div>
);
