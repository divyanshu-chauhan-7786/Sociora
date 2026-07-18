import { useState } from "react";

import type { Generation, PlatformId, ScheduledPost } from "../../types";
import { FREE_PLATFORM_IDS } from "../../constants/platforms";
import { todayInputValue } from "../../utils/date";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { PlatformSelector } from "./PlatformSelector";

interface SchedulePostModalProps {
  generation: Generation;
  onClose: () => void;
  onSchedule: (post: ScheduledPost) => void;
}

export const SchedulePostModal = ({
  generation,
  onClose,
  onSchedule,
}: SchedulePostModalProps) => {
  const [platforms, setPlatforms] = useState<PlatformId[]>(["linkedin"]);
  const [date, setDate] = useState(todayInputValue());
  const [time, setTime] = useState("09:00");
  const canSchedule =
    platforms.length > 0 &&
    platforms.every((platform) => FREE_PLATFORM_IDS.includes(platform)) &&
    date.length > 0 &&
    time.length > 0;

  const handleSchedule = () => {
    if (!canSchedule) {
      return;
    }

    onSchedule({
      id: `ai-${crypto.randomUUID()}`,
      content: generation.content,
      platforms,
      scheduledDate: date,
      scheduledTime: time,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      mediaUrl: generation.mediaUrl,
      mediaName: generation.mediaUrl ? "ai-generated-image.jpg" : undefined,
      mediaType: generation.mediaUrl ? "image" : undefined,
      source: "ai",
    });
  };

  return (
    <Modal
      description="Choose where and when this generated post should enter the publishing queue."
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button className="border-0 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 dark:shadow-none" disabled={!canSchedule} onClick={handleSchedule}>
            Save to queue
          </Button>
        </>
      }
      onClose={onClose}
      title="Schedule post"
    >
      <div className="space-y-5">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="line-clamp-5 text-sm font-medium leading-6 text-slate-700">
            {generation.content}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-800">Platforms</label>
          <PlatformSelector availablePlatforms={FREE_PLATFORM_IDS} onChange={setPlatforms} value={platforms} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">Date</span>
            <input
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
              min={todayInputValue()}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">Time</span>
            <input
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
              onChange={(event) => setTime(event.target.value)}
              type="time"
              value={time}
            />
          </label>
        </div>
      </div>
    </Modal>
  );
};
