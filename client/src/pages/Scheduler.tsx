import { AlertTriangle, CalendarPlus, Film, Hash, ImagePlus, Loader2, MapPin, Music2, RotateCcw, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";

import { PlatformSelector } from "../components/scheduler/PlatformSelector";
import { PostCard } from "../components/scheduler/PostCard";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { CardSkeleton } from "../components/ui/Skeleton";
import { getPlatform, isPlatformActive } from "../constants/platforms";
import { accountApi, generationApi, postApi, realtimeApi } from "../lib/api";
import type { PlatformId, PostStatus, ScheduledPost, SocialAccount } from "../types";
import { todayInputValue } from "../utils/date";

const tabs: Array<{ label: string; value: PostStatus }> = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Publishing", value: "publishing" },
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

const unpublishablePlatforms: PlatformId[] = ["facebook", "linkedin", "twitter", "youtube"];

const Scheduler = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [scheduledDate, setScheduledDate] = useState(todayInputValue());
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<ScheduledPost["mediaType"]>();
  const [reelAudioName, setReelAudioName] = useState("");
  const [reelCoverUrl, setReelCoverUrl] = useState("");
  const [reelShareToFeed, setReelShareToFeed] = useState(true);
  const [activeTab, setActiveTab] = useState<PostStatus>("scheduled");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ScheduledPost | null>(null);
  const [deletePlatforms, setDeletePlatforms] = useState<PlatformId[]>([]);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadScheduler = useCallback(async () => {
    try {
      const [nextPosts, nextAccounts] = await Promise.all([
        postApi.list(),
        accountApi.list(),
      ]);

      setPosts(nextPosts);
      setAccounts(nextAccounts);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Scheduler failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      postApi.list(),
      accountApi.list(),
    ])
      .then(([nextPosts, nextAccounts]) => {
        setPosts(nextPosts);
        setAccounts(nextAccounts);
        setError("");
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Scheduler failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const url = realtimeApi.getUrl();

    if (!url) {
      return;
    }

    const events = new EventSource(url);
    const refresh = () => void loadScheduler();

    events.addEventListener("posts:changed", refresh);
    events.addEventListener("activity:changed", refresh);
    events.onerror = () => {
      events.close();
    };

    return () => {
      events.removeEventListener("posts:changed", refresh);
      events.removeEventListener("activity:changed", refresh);
      events.close();
    };
  }, [loadScheduler]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadScheduler();
    }, 20_000);

    return () => window.clearInterval(interval);
  }, [loadScheduler]);

  const connectedPlatforms = useMemo(
    () =>
      Array.from(new Set(
        accounts
          .filter((account) => account.status === "connected")
          .filter((account) => isPlatformActive(account.platform))
          .map((account) => account.platform),
      )),
    [accounts],
  );

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

  const reelPlatformsSelected = selectedPlatforms.some((platform) => platform === "instagram" || platform === "facebook");
  const isVideoMedia = mediaType === "video" || mediaType === "reel";
  const canUseReel = Boolean(previewUrl) && isVideoMedia && reelPlatformsSelected;

  const resetForm = () => {
    setContent("");
    setSelectedPlatforms([]);
    setScheduledDate(todayInputValue());
    setScheduledTime("09:00");
    setLocation("");
    setPreviewUrl(undefined);
    setMediaFile(null);
    setMediaType(undefined);
    setReelAudioName("");
    setReelCoverUrl("");
    setReelShareToFeed(true);
    setEditingPostId(null);
    setHashtagSuggestions([]);
  };

  const uploadMedia = async (file: File) => {
    const { uploadUrl, publicUrl } = await postApi.getMediaUploadUrl({
      filename: file.name,
      contentType: file.type,
    });

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Media upload failed");
    }

    return publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !content.trim() ||
      selectedPlatforms.length === 0 ||
      selectedPlatforms.some((platform) => !connectedPlatforms.includes(platform))
    ) {
      return;
    }

    if (mediaType === "reel" && !canUseReel) {
      setError("Select Instagram or Facebook and upload a video before scheduling a Reel.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const currentPost = posts.find((post) => post.id === editingPostId);
      const uploadedMediaUrl = mediaFile ? await uploadMedia(mediaFile) : undefined;
      const nextMediaUrl = uploadedMediaUrl ?? previewUrl ?? currentPost?.mediaUrl;
      const nextMediaType = mediaFile ? mediaType : mediaType ?? currentPost?.mediaType;
      const payload = {
        content,
        platforms: selectedPlatforms,
        scheduledDate,
        scheduledTime,
        location: location.trim(),
        mediaName: mediaFile?.name ?? currentPost?.mediaName,
        mediaType: nextMediaType,
        mediaUrl: nextMediaUrl,
        reelAudioName: nextMediaType === "reel" ? reelAudioName.trim() : "",
        reelCoverUrl: nextMediaType === "reel" ? reelCoverUrl.trim() : "",
        reelShareToFeed: nextMediaType === "reel" ? reelShareToFeed : true,
        status: "scheduled" as const,
        source: "manual" as const,
      };

      if (editingPostId) {
        const updatedPost = await postApi.update(editingPostId, payload);
        setPosts((currentPosts) => currentPosts.map((post) => post.id === editingPostId ? updatedPost : post));
      } else {
        const createdPost = await postApi.create(payload);
        setPosts((currentPosts) => [createdPost, ...currentPosts]);
      }

      resetForm();
      setActiveTab("scheduled");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Post could not be saved");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: ScheduledPost) => {
    setContent(post.content);
    setSelectedPlatforms(post.platforms);
    setScheduledDate(post.scheduledDate);
    setScheduledTime(post.scheduledTime);
    setLocation(post.location ?? "");
    setPreviewUrl(post.mediaUrl);
    setMediaType(post.mediaType);
    setReelAudioName(post.reelAudioName ?? "");
    setReelCoverUrl(post.reelCoverUrl ?? "");
    setReelShareToFeed(post.reelShareToFeed ?? true);
    setEditingPostId(post.id);
    document.getElementById("scheduler-composer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (post: ScheduledPost) => {
    if (post.status === "published") {
      setDeleteTarget(post);
      setDeletePlatforms(post.platforms.filter((platform) => unpublishablePlatforms.includes(platform)));
      setDeleteError("");
      return;
    }

    const confirmed = window.confirm("Delete this post from the queue?");

    if (!confirmed) {
      return;
    }

    await postApi.delete(post.id);
    setPosts((currentPosts) => currentPosts.filter((currentPost) => currentPost.id !== post.id));
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeleteTarget(null);
    setDeletePlatforms([]);
    setDeleteError("");
  };

  const toggleDeletePlatform = (platform: PlatformId) => {
    setDeletePlatforms((currentPlatforms) =>
      currentPlatforms.includes(platform)
        ? currentPlatforms.filter((currentPlatform) => currentPlatform !== platform)
        : [...currentPlatforms, platform],
    );
  };

  const handleUnpublish = async () => {
    if (!deleteTarget) {
      return;
    }

    if (deletePlatforms.length === 0) {
      setDeleteError("Select at least one supported platform.");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const result = await postApi.unpublish(deleteTarget.id, deletePlatforms);

      if (result.deleted) {
        setPosts((currentPosts) => currentPosts.filter((post) => post.id !== deleteTarget.id));
      } else {
        const updatedPost = result.post;

        if (updatedPost) {
          setPosts((currentPosts) => currentPosts.map((post) => post.id === updatedPost.id ? updatedPost : post));
        }
      }

      if (result.failures && result.failures.length > 0) {
        const failedPlatforms = result.failures.map((failure) => `${failure.platform}: ${failure.message}`).join(" ");
        setDeleteError(failedPlatforms);
        setDeleteTarget(result.post ?? deleteTarget);
        setDeletePlatforms((currentPlatforms) =>
          currentPlatforms.filter((platform) => result.failures?.some((failure) => failure.platform === platform)),
        );
        return;
      }

      setDeleteTarget(null);
      setDeletePlatforms([]);
      setDeleteError("");
    } catch (requestError) {
      setDeleteError(requestError instanceof Error ? requestError.message : "Post could not be deleted from the selected platforms.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveFromSocioraOnly = async () => {
    if (!deleteTarget) {
      return;
    }

    const confirmed = window.confirm(
      "This will only remove the post from Sociora. It will not delete it from Instagram or any other social platform. Continue?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await postApi.delete(deleteTarget.id);
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeletePlatforms([]);
      setDeleteError("");
    } catch (requestError) {
      setDeleteError(requestError instanceof Error ? requestError.message : "Post could not be removed from Sociora.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      const publishedPost = await postApi.publish(postId);
      setPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? publishedPost : post));
      setActiveTab(publishedPost.status);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Post could not be published");
    }
  };

  const handleGenerateHashtags = async () => {
    if (!content.trim()) {
      setError("Write content before generating hashtags.");
      return;
    }

    setGeneratingHashtags(true);
    setError("");

    try {
      const { hashtags } = await generationApi.suggestHashtags({
        content,
        platforms: selectedPlatforms,
      });
      setHashtagSuggestions(hashtags);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Hashtags could not be generated");
    } finally {
      setGeneratingHashtags(false);
    }
  };

  const addHashtagToContent = (hashtag: string) => {
    setContent((currentContent) => {
      const existingHashtags = currentContent.match(/#[A-Za-z0-9_]+/g) ?? [];
      const alreadyAdded = existingHashtags.some((existingHashtag) => existingHashtag.toLowerCase() === hashtag.toLowerCase());

      if (alreadyAdded) {
        return currentContent;
      }

      const nextContent = `${currentContent.trimEnd()}${currentContent.trim() ? " " : ""}${hashtag}`;
      return nextContent.length <= 480 ? nextContent : currentContent;
    });
  };

  const canSubmit =
    content.trim().length > 0 &&
    selectedPlatforms.length > 0 &&
    selectedPlatforms.every((platform) => connectedPlatforms.includes(platform)) &&
    selectedPlatforms.every(isPlatformActive) &&
    (mediaType !== "reel" || canUseReel);

  return (
    <>
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
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
          )}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Platforms</label>
            <PlatformSelector
              availablePlatforms={connectedPlatforms}
              onChange={setSelectedPlatforms}
              value={selectedPlatforms}
            />
            <p className="mt-2 text-xs font-bold text-slate-500">
              {connectedPlatforms.length > 0
                ? `${connectedPlatforms.length} connected channel${connectedPlatforms.length > 1 ? "s" : ""} available for real publishing.`
                : "Connect a social account before scheduling a post."}
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Location</span>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900"
                maxLength={120}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Add a place for Instagram or Facebook..."
                value={location}
              />
            </div>
          </label>

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

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-coral-600" />
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">Hashtag suggestions</span>
              </div>
              <Button
                disabled={!content.trim() || generatingHashtags}
                icon={generatingHashtags ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
                onClick={handleGenerateHashtags}
                size="sm"
                variant="secondary"
              >
                {generatingHashtags ? "Generating..." : "Suggest hashtags"}
              </Button>
            </div>
            {hashtagSuggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {hashtagSuggestions.map((hashtag) => (
                  <button
                    className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-black text-teal-700 transition hover:border-teal-300 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100 dark:border-teal-500/30 dark:bg-slate-950 dark:text-teal-300"
                    key={hashtag}
                    onClick={() => addHashtagToContent(hashtag)}
                    type="button"
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            )}
          </div>

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

                  const nextMediaType = file.type.startsWith("video/")
                    ? reelPlatformsSelected ? "reel" : "video"
                    : "image";

                  setMediaFile(file);
                  setMediaType(nextMediaType);
                  setPreviewUrl(URL.createObjectURL(file));

                  if (nextMediaType !== "reel") {
                    setReelAudioName("");
                    setReelCoverUrl("");
                    setReelShareToFeed(true);
                  }
                }}
                type="file"
              />
            </label>
            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {isVideoMedia ? (
                  <video className="max-h-80 w-full" controls src={previewUrl} />
                ) : (
                  <img alt="Selected media preview" className="max-h-80 w-full object-cover" src={previewUrl} />
                )}
              </div>
            )}
            {previewUrl && isVideoMedia && (
              <div className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-black transition ${
                      mediaType === "video"
                        ? "border-slate-950 bg-slate-950 text-white dark:border-teal-500 dark:bg-teal-500"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                    onClick={() => setMediaType("video")}
                    type="button"
                  >
                    <Film className="h-4 w-4" />
                    Video post
                  </button>
                  <button
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-black transition ${
                      mediaType === "reel"
                        ? "border-coral-500 bg-coral-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-coral-200 hover:text-coral-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    disabled={!reelPlatformsSelected}
                    onClick={() => setMediaType("reel")}
                    type="button"
                  >
                    <Film className="h-4 w-4" />
                    Instagram Reel
                  </button>
                </div>

                {mediaType === "reel" && (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Share to profile feed</span>
                      <input
                        checked={reelShareToFeed}
                        className="h-5 w-5 rounded border-slate-300 text-coral-600 focus:ring-coral-200"
                        onChange={(event) => setReelShareToFeed(event.target.checked)}
                        type="checkbox"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <Music2 className="h-4 w-4 text-coral-600" />
                        Original audio name
                      </span>
                      <input
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        maxLength={100}
                        onChange={(event) => setReelAudioName(event.target.value)}
                        placeholder="Example: Sociora original audio"
                        value={reelAudioName}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Reel cover URL</span>
                      <input
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        onChange={(event) => setReelCoverUrl(event.target.value)}
                        placeholder="https://..."
                        type="url"
                        value={reelCoverUrl}
                      />
                    </label>

                    <p className="text-xs font-semibold leading-5 text-slate-500">
                      Music should be inside the uploaded video. Instagram publishing APIs allow naming original audio, not picking licensed music tracks.
                    </p>
                  </div>
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
              {saving ? "Saving..." : editingPostId ? "Update post" : "Schedule post"}
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
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

      {deleteTarget && (
        <Modal
          description="Choose where this published post should be deleted."
          footer={(
            <>
              <Button disabled={deleting} onClick={closeDeleteModal} variant="secondary">
                Cancel
              </Button>
              <Button disabled={deleting} onClick={handleRemoveFromSocioraOnly} variant="secondary">
                Remove from Sociora only
              </Button>
              <Button
                disabled={deleting || deletePlatforms.length === 0}
                icon={deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                onClick={handleUnpublish}
                variant="danger"
              >
                {deleting ? "Deleting..." : "Delete from selected"}
              </Button>
            </>
          )}
          onClose={closeDeleteModal}
          title="Delete published post"
        >
          <div className="space-y-4">
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-700">
              {deleteTarget.content}
            </p>

            {deleteError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold leading-5 text-red-700">
                {deleteError}
              </p>
            )}

            <div className="space-y-2">
              {deleteTarget.platforms.map((platform) => {
                const platformMeta = getPlatform(platform);
                const supported = unpublishablePlatforms.includes(platform);
                const checked = deletePlatforms.includes(platform);

                return (
                  <label
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-3"
                    key={platform}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-slate-900">
                        {platformMeta?.name ?? platform}
                      </span>
                      {!supported && (
                        <span className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Instagram does not allow published post deletion through this SDK. Delete it in Instagram, or remove only the Sociora record.
                        </span>
                      )}
                    </span>
                    <input
                      checked={checked}
                      className="h-5 w-5 rounded border-slate-300 text-coral-600 focus:ring-coral-200"
                      disabled={!supported || deleting}
                      onChange={() => toggleDeletePlatform(platform)}
                      type="checkbox"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Scheduler;
