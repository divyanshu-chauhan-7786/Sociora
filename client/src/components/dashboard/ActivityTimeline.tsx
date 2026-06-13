import { CalendarCheck, CheckCircle2, PlugZap, Sparkles } from "lucide-react";

import type { ActivityItem } from "../../types";
import { formatDateTime } from "../../utils/date";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { PlatformBadge } from "../ui/PlatformBadge";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityIcon = {
  published: CheckCircle2,
  scheduled: CalendarCheck,
  connected: PlugZap,
  generated: Sparkles,
};

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => (
  <Card className="overflow-hidden">
    <CardHeader>
      <div>
        <CardTitle>Activity Feed</CardTitle>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Publishing, account, and AI events across the workspace.
        </p>
      </div>
      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
        {activities.length} events
      </span>
    </CardHeader>

    {activities.length === 0 ? (
      <div className="p-5">
        <EmptyState
          description="Connect accounts and schedule content to see your workspace timeline."
          icon={<CalendarCheck className="h-5 w-5" />}
          title="No activity yet"
        />
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {activities.map((activity, index) => {
          const Icon = activityIcon[activity.type];

          return (
            <div key={activity.id} className="relative flex gap-4 px-5 py-4 hover:bg-teal-50/30">
              {index < activities.length - 1 && (
                <span className="absolute left-[2.15rem] top-12 h-[calc(100%-2rem)] w-px bg-slate-200" />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-50 text-coral-700">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-slate-950">{activity.title}</h3>
                  {activity.platform && <PlatformBadge compact platformId={activity.platform} />}
                </div>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {activity.description}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {formatDateTime(activity.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </Card>
);
