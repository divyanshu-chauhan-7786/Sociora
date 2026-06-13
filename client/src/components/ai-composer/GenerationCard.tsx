import { CalendarPlus, Copy, Image } from "lucide-react";

import type { Generation } from "../../types";
import { formatDate } from "../../utils/date";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface GenerationCardProps {
  generation: Generation;
  onSchedule: (generation: Generation) => void;
}

export const GenerationCard = ({ generation, onSchedule }: GenerationCardProps) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
    {generation.mediaUrl ? (
      <img
        alt=""
        className="h-44 w-full object-cover"
        src={generation.mediaUrl}
      />
    ) : (
      <div className="flex h-44 w-full items-center justify-center bg-[linear-gradient(135deg,#fff1f2,#f0fdfa)] text-slate-400">
        <Image className="h-7 w-7" />
      </div>
    )}

    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="brand">{generation.tone}</Badge>
        <time className="text-xs font-semibold text-slate-400">
          {formatDate(generation.createdAt)}
        </time>
      </div>
      <p className="mt-3 line-clamp-6 flex-1 text-sm font-semibold leading-6 text-slate-700">
        {generation.content}
      </p>
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <Button
          className="flex-1"
          icon={<Copy className="h-4 w-4" />}
          onClick={() => void navigator.clipboard.writeText(generation.content)}
          variant="secondary"
        >
          Copy
        </Button>
        <Button
          className="flex-1 border-0 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 dark:shadow-none"
          icon={<CalendarPlus className="h-4 w-4" />}
          onClick={() => onSchedule(generation)}
        >
          Schedule
        </Button>
      </div>
    </div>
  </article>
);
