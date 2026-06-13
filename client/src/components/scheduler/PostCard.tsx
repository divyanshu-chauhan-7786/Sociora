import { CalendarClock, Copy, Pencil, Rocket, Trash2 } from "lucide-react";

import type { ScheduledPost } from "../../types";
import { cn } from "../../utils/cn";
import { formatSchedule, getTimeRemaining } from "../../utils/date";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { PlatformBadge } from "../ui/PlatformBadge";

interface PostCardProps {
  post: ScheduledPost;
  onDelete?: (postId: string) => void;
  onEdit?: (post: ScheduledPost) => void;
  onPublish?: (postId: string) => void;
}

const statusTone = {
  scheduled: "brand",
  published: "success",
  failed: "danger",
  draft: "warning",
} as const;

export const PostCard = ({ post, onDelete, onEdit, onPublish }: PostCardProps) => (
  <Card className="group overflow-hidden p-4 hover:border-red-100 hover:shadow-md dark:hover:border-slate-700">
    {post.mediaUrl && (
      <img
        alt=""
        className="mb-4 h-40 w-full rounded-lg object-cover"
        src={post.mediaUrl}
      />
    )}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.platforms.map((platform) => (
            <PlatformBadge key={platform} compact platformId={platform} />
          ))}
        </div>
        <p className="line-clamp-4 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{post.content}</p>
      </div>
      <Badge tone={statusTone[post.status]}>{post.status}</Badge>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
      <span className="inline-flex items-center gap-1">
        <CalendarClock className="h-3.5 w-3.5" />
        {formatSchedule(post.scheduledDate, post.scheduledTime)}
      </span>
      {post.status === "scheduled" && (
        <span
          className={cn(
            getTimeRemaining(post.scheduledDate, post.scheduledTime) === "Past due"
              ? "text-red-600"
              : "text-green-600",
          )}
        >
          {getTimeRemaining(post.scheduledDate, post.scheduledTime)}
        </span>
      )}
    </div>

    {post.mediaName && (
      <p className="mt-2 text-xs font-medium text-slate-400">Media: {post.mediaName}</p>
    )}

    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
      {post.status !== "published" && onPublish && (
        <Button
          icon={<Rocket className="h-4 w-4" />}
          onClick={() => onPublish(post.id)}
          size="sm"
        >
          Publish
        </Button>
      )}
      {onEdit && (
        <Button
          icon={<Pencil className="h-4 w-4" />}
          onClick={() => onEdit(post)}
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
      )}
      <Button
        icon={<Copy className="h-4 w-4" />}
        onClick={() => void navigator.clipboard.writeText(post.content)}
        size="sm"
        variant="ghost"
      >
        Copy
      </Button>
      {onDelete && (
        <Button
          aria-label="Delete post"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(post.id)}
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      )}
    </div>
  </Card>
);
