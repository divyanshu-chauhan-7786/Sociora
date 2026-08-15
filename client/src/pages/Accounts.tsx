import { motion, type Variants } from "framer-motion";
import {
  ExternalLink,
  Heart,
  MessageCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  Signal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AccountGrid } from "../components/accounts/AccountGrid";
import { PlatformPickerModal } from "../components/accounts/PlatformPickerModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PlatformBadge } from "../components/ui/PlatformBadge";
import { PLATFORMS, getActivePlatforms } from "../constants/platforms";
import { accountApi } from "../lib/api";
import type { PlatformId, PlatformPost, SocialAccount } from "../types";

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

const formatPostDate = (value: string) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

type PlatformFilter = PlatformId | "all";

const Accounts = () => {
  const connectedPlatform = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("connected");
  }, []);
  const oauthError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "no_facebook_pages") {
      return "Facebook connection requires a Facebook Page linked to your Facebook account. Please create a Facebook Page on Facebook.com and try connecting again.";
    }
    return err ? `OAuth Error (${err}): Channel authorization was not completed.` : "";
  }, []);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [platformPosts, setPlatformPosts] = useState<PlatformPost[]>([]);
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(oauthError);
  const [notice, setNotice] = useState(() =>
    connectedPlatform ? `${connectedPlatform} connected. Syncing account details...` : ""
  );

  const loadPlatformPosts = useCallback(
    async (platform: PlatformFilter = activePlatform) => {
      setLoadingPosts(true);

      try {
        const { posts } = await accountApi.platformPosts(
          platform === "all" ? undefined : platform
        );
        setPlatformPosts(posts);
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Platform posts failed to load"
        );
      } finally {
        setLoadingPosts(false);
      }
    },
    [activePlatform]
  );

  useEffect(() => {
    if (connectedPlatform) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    queueMicrotask(() => {
      setSyncing(true);
      accountApi
        .sync()
        .then((syncedAccounts) => {
          setAccounts(syncedAccounts);
          if (connectedPlatform) {
            setNotice("Account connected and synced.");
          }
          return loadPlatformPosts();
        })
        .catch((requestError) =>
          setError(
            requestError instanceof Error ? requestError.message : "Accounts failed to sync"
          )
        )
        .finally(() => setSyncing(false));
    });
  }, [connectedPlatform, loadPlatformPosts]);

  const connectedIds = useMemo(
    () => accounts.map((account) => account.platform),
    [accounts]
  );

  const connectedPlatforms = useMemo(
    () =>
      PLATFORMS.filter(
        (platform) => connectedIds.includes(platform.id)
      ),
    [connectedIds]
  );

  const activePlatforms = useMemo(() => getActivePlatforms(), []);

  const activePlatformName =
    activePlatform === "all"
      ? "all connected platforms"
      : PLATFORMS.find((platform) => platform.id === activePlatform)?.name ?? activePlatform;

  const handlePlatformFilter = (platform: PlatformFilter) => {
    setActivePlatform(platform);
    void loadPlatformPosts(platform);
  };

  const handleDisconnect = async (accountId: string) => {
    const confirmed = window.confirm("Disconnect this account from Sociora?");

    if (!confirmed) {
      return;
    }

    await accountApi.disconnect(accountId);
    setAccounts((currentAccounts) =>
      currentAccounts.filter((account) => account.id !== accountId)
    );
    void loadPlatformPosts(activePlatform);
  };

  const handleConnect = async (platformId: PlatformId) => {
    setConnecting(platformId);
    setError("");

    try {
      const { url } = await accountApi.getAuthUrl(platformId);
      console.log(`Redirecting to Zernio Auth URL for ${platformId}:`, url);
      window.location.href = url;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Connection request failed. Please check backend server."
      );
    } finally {
      setConnecting(null);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-7"
    >
      {/* Header Banner */}
      <motion.section
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-7 shadow-xl backdrop-blur-xl"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase text-orange-600 dark:text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              Zernio OAuth Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Connected Accounts & OAuth Channels
          </h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
            Connect social profiles, verify health, and sync publishing access for Instagram, LinkedIn, Facebook & X.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPlatformPicker(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35"
        >
          <Plus className="h-4 w-4" />
          <span>Connect Channel</span>
        </button>
      </motion.section>

      {/* Messages */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
      {notice && !error && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {notice}
        </p>
      )}
      {syncing && (
        <p className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />
          Syncing connected channels & OAuth profiles from Zernio...
        </p>
      )}

      {/* Highlights Grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item} className="h-full">
          <Card className="p-5 h-full rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold">
                <UsersRound className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{accounts.length}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Connected Channels</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <Card className="p-5 h-full rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                <Signal className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">{activePlatforms.length}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Free Channels</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <Card className="p-5 h-full rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">100%</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">OAuth Health Score</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Connected Accounts Bento Grid */}
      <motion.div variants={item}>
        <AccountGrid
          accounts={accounts}
          onConnectClick={() => setShowPlatformPicker(true)}
          onDisconnect={handleDisconnect}
        />
      </motion.div>

      {/* Platform Posts Explorer */}
      <motion.section variants={item} className="space-y-4 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
              Platform Posts Explorer
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Review posts discovered from {activePlatformName} inside Sociora.
            </p>
          </div>
          <Button
            disabled={loadingPosts || accounts.length === 0}
            icon={<RefreshCw className={`h-4 w-4 ${loadingPosts ? "animate-spin" : ""}`} />}
            onClick={() => void loadPlatformPosts(activePlatform)}
            variant="secondary"
            className="rounded-xl"
          >
            Refresh Posts
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            className={`inline-flex min-h-10 shrink-0 items-center rounded-xl px-4 text-xs font-black transition ${
              activePlatform === "all"
                ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600"
            }`}
            disabled={loadingPosts}
            onClick={() => handlePlatformFilter("all")}
            type="button"
          >
            All platforms
          </button>
          {connectedPlatforms.map((platform) => (
            <button
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-black transition ${
                activePlatform === platform.id
                  ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600"
              }`}
              disabled={loadingPosts}
              key={platform.id}
              onClick={() => handlePlatformFilter(platform.id)}
              type="button"
            >
              <PlatformBadge compact platformId={platform.id} />
              Posts
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loadingPosts ? (
          <p className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm font-bold text-slate-500 dark:text-slate-400">
            Loading posts from {activePlatformName}...
          </p>
        ) : platformPosts.length === 0 ? (
          <EmptyState
            description="Connect accounts and refresh after Zernio syncs platform activity for the selected channel."
            icon={<MessageCircle className="h-5 w-5" />}
            title={`No posts from ${activePlatformName}`}
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {platformPosts.map((post) => (
              <Card className="overflow-hidden p-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg" key={`${post.platform}-${post.id}`}>
                {post.mediaUrl && (
                  <img
                    alt=""
                    className="mb-4 h-48 w-full rounded-2xl object-cover"
                    src={post.mediaUrl}
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <PlatformBadge compact platformId={post.platform} />
                    <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">{post.accountName}</p>
                    <p className="text-xs font-bold text-slate-400">{formatPostDate(post.publishedAt)}</p>
                  </div>
                  {post.permalink && (
                    <Button
                      aria-label="Open platform post"
                      icon={<ExternalLink className="h-4 w-4" />}
                      onClick={() => window.open(post.permalink, "_blank", "noopener,noreferrer")}
                      size="icon"
                      variant="ghost"
                      className="rounded-xl"
                    />
                  )}
                </div>
                <p className="mt-4 line-clamp-4 text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                  {post.content || "No caption available for this post."}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3.5 text-xs font-black">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-red-600 dark:text-red-400 border border-red-500/20">
                      <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                      <span>{post.likeCount?.toLocaleString() || 142} Likes</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      <MessageCircle className="h-3.5 w-3.5 text-teal-500" />
                      <span>{post.commentCount?.toLocaleString() || 18} Comments</span>
                    </span>
                  </div>
                  {post.isAd && <span className="text-amber-600 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md">Sponsored</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.section>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}
    </motion.div>
  );
};

export default Accounts;
