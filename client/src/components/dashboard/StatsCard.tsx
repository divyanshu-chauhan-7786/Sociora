import type { ElementType } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ElementType;
  trend: string;
  trendDirection?: "up" | "down";
  accentClass?: string;
}

export const StatsCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  accentClass = "bg-coral-50 text-coral-700",
}: StatsCardProps) => {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className="group overflow-hidden p-5 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={cn("rounded-lg p-3 transition group-hover:scale-105", accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
        <TrendIcon className={cn("h-3.5 w-3.5", trendDirection === "up" ? "text-teal-600" : "text-amber-600")} />
        {trend}
      </div>
    </Card>
  );
};
