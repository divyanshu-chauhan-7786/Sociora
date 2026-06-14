import { CalendarPlus, ImagePlus, RotateCcw, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";

import { PlatformSelector } from "../components/scheduler/PlatformSelector";
import { PostCard } from "../components/scheduler/PostCard";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";
import { mockPosts } from "../constants/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PlatformId, PostStatus, ScheduledPost } from "../types";
import { todayInputValue } from "../utils/date";

const tabs: Array<{ label: string; value: PostStatus }> = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Failed", value: "failed" },
  { label: "Draft", value: "draft" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const Scheduler = () => {
  const [posts, setPosts] = useLocalStorage<ScheduledPost[]>(
    "sociora.scheduler.posts",
    mockPosts,
  );
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [scheduledDate, setScheduledDate] = useState(todayInputValue());
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<PostStatus>("scheduled");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading] = useState(false);

  const visiblePosts = useMemo(
    () =>
      posts
        .filter((post) => post.status === activeTab)
        .sort((firstPost, secondPost) => {
          const firstDate = new Date(`${firstPost.scheduledDate}T${firstPost.scheduledTime}`);
          const secondDate = new Date(`${secondPost.scheduledDate}T${secondPost.scheduledTime}`);
          return activeTab === "published"
            ? secondDate.getTime() - firstDate.getTime()
            : firstDate.getTime() - secondDate.getTime();
        }),
    [activeTab, posts],
  );

  const resetForm = () => {
    setContent("");
    setSelectedPlatforms([]);
    setScheduledDate(todayInputValue());
    setScheduledTime("09:00");
    setPreviewUrl(undefined);
    setMediaFile(null);
    setEditingPostId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim() || selectedPlatforms.length === 0) {
      return;
    }

    if (editingPostId) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === editingPostId
            ? {
                ...post,
                content,
                platforms: selectedPlatforms,
                scheduledDate,
                scheduledTime,
                mediaName: mediaFile?.name ?? post.mediaName,
                mediaType: mediaFile?.type.startsWith("video/") ? "video" : post.mediaType,
                mediaUrl: previewUrl ?? post.mediaUrl,
                status: "scheduled",
                updatedAt: new Date().toISOString(),
              }
            : post,
        ),
      );
    } else {
      const post: ScheduledPost = {
        id: `post-${crypto.randomUUID()}`,
        content,
        platforms: selectedPlatforms,
        scheduledDate,
        scheduledTime,
        mediaName: mediaFile?.name,
        mediaType: mediaFile?.type.startsWith("video/") ? "video" : mediaFile ? "image" : undefined,
        mediaUrl: previewUrl,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        source: "manual",
      };

      setPosts((currentPosts) => [post, ...currentPosts]);
    }

    resetForm();
    setActiveTab("scheduled");
  };

  const handleEdit = (post: ScheduledPost) => {
    setContent(post.content);
    setSelectedPlatforms(post.platforms);
    setScheduledDate(post.scheduledDate);
    setScheduledTime(post.scheduledTime);
    setPreviewUrl(post.mediaUrl);
    setEditingPostId(post.id);
    document.getElementById("scheduler-composer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = (postId: string) => {
    const confirmed = window.confirm("Delete this post from the queue?");

    if (!confirmed) {
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  };

  const handlePublish = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              status: "published",
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : post,
      ),
    );
    setActiveTab("published");
  };

  const canSubmit = content.trim().length > 0 && selectedPlatforms.length > 0;

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.1fr]"
    >
      <motion.div variants={item} className="self-start">
        <Card className="rounded-[1.5rem]" id="scheduler-composer">
        <CardHeader>
          <div>
            <CardTitle>{editingPostId ? "Edit scheduled post" : "Compose post"}</CardTitle>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Create a platform-aware post and place it into the publishing queue.
            </p>
          </div>
        </CardHeader>

        <form className="space-y-5 p-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Platforms</label>
            <PlatformSelector onChange={setSelectedPlatforms} value={selectedPlatforms} />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Content</span>
            <textarea
              className="min-h-40 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900"
              maxLength={480}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write a caption, launch note, update, or announcement..."
              value={content}
            />
            <span className="mt-2 block text-right text-xs font-semibold text-slate-400">
              {content.length}/480
            </span>
          </label>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200" htmlFor="media-upload">
              Media
            </label>
            <label
              className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-4 py-6 text-center transition hover:border-teal-300 hover:bg-teal-50/30 dark:border-slate-700 dark:bg-[linear-gradient(135deg,#0f172a,#1e293b)] dark:hover:border-teal-500"
              htmlFor="media-upload"
            >
              <ImagePlus className="h-6 w-6 text-coral-600" />
              <span className="mt-2 text-sm font-black text-slate-800 dark:text-slate-200">Upload image or video</span>
              <span className="mt-1 text-xs font-semibold text-slate-500">JPG, PNG, GIF, or MP4</span>
              <input
                accept="image/*,video/*"
                className="sr-only"
                id="media-upload"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  setMediaFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
                type="file"
              />
            </label>
            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {mediaFile?.type.startsWith("video/") ? (
                  <video className="max-h-80 w-full" controls src={previewUrl} />
                ) : (
                  <img alt="Selected media preview" className="max-h-80 w-full object-cover" src={previewUrl} />
                )}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Date</span>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-400"
                min={todayInputValue()}
                onChange={(event) => setScheduledDate(event.target.value)}
                type="date"
                value={scheduledDate}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Time</span>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-teal-400"
                onChange={(event) => setScheduledTime(event.target.value)}
                type="time"
                value={scheduledTime}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row dark:border-slate-800">
            <Button
              className="border-0 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30"
              disabled={!canSubmit}
              icon={<CalendarPlus className="h-4 w-4" />}
              type="submit"
            >
              {editingPostId ? "Update post" : "Schedule post"}
            </Button>
            <Button icon={<RotateCcw className="h-4 w-4" />} onClick={resetForm} variant="secondary">
              Clear
            </Button>
          </div>
        </form>
        </Card>
      </motion.div>

      <motion.div variants={item} className="h-full">
        <Card className="flex h-full flex-col overflow-hidden rounded-[1.5rem]">
        <CardHeader>
          <div>
            <CardTitle>Publishing Queue</CardTitle>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Track scheduled, published, failed, and draft content.
            </p>
          </div>
        </CardHeader>

        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tabs.map((tab) => {
              const count = posts.filter((post) => post.status === tab.value).length;
              const active = activeTab === tab.value;

              return (
                <button
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100 ${
                    active
                      ? "bg-slate-950 text-white shadow-sm shadow-slate-900/15 dark:bg-teal-500 dark:text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  }`}
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  type="button"
                >
                  {tab.label}
                  <span className={active ? "ml-2 text-white/80" : "ml-2 text-slate-400"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : visiblePosts.length === 0 ? (
            <EmptyState
              description="Create a post or schedule generated AI content to populate this queue."
              icon={<Send className="h-5 w-5" />}
              title={`No ${activeTab} posts`}
            />
          ) : (
            <div className="space-y-3">
              {visiblePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                >
                  <PostCard
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onPublish={handlePublish}
                    post={post}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Scheduler;
