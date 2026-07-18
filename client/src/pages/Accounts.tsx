import { ExternalLink, Heart, MessageCircle, Plus, RefreshCw, ShieldCheck, Signal, UsersRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";

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
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [platformPosts, setPlatformPosts] = useState<PlatformPost[]>([]);
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(() =>
    connectedPlatform ? `${connectedPlatform} connected. Syncing account details...` : "",
  );

  const loadPlatformPosts = useCallback(async (platform: PlatformFilter = activePlatform) => {
    setLoadingPosts(true);

    try {
      const { posts } = await accountApi.platformPosts(platform === "all" ? undefined : platform);
      setPlatformPosts(posts);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Platform posts failed to load");
    } finally {
      setLoadingPosts(false);
    }
  }, [activePlatform]);

  useEffect(() => {
    if (connectedPlatform) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    queueMicrotask(() => {
      setSyncing(true);
      accountApi.sync()
        .then((syncedAccounts) => {
          setAccounts(syncedAccounts);
          if (connectedPlatform) {
            setNotice("Account connected and synced.");
          }
          return loadPlatformPosts();
        })
        .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Accounts failed to sync"))
        .finally(() => setSyncing(false));
    });
  }, [connectedPlatform, loadPlatformPosts]);

  const connectedIds = useMemo(
    () => accounts.map((account) => account.platform),
    [accounts],
  );

  const connectedPlatforms = useMemo(
    () => PLATFORMS.filter((platform) => connectedIds.includes(platform.id) && platform.access === "free"),
    [connectedIds],
  );

  const activePlatforms = useMemo(() => getActivePlatforms(), []);

  const activePlatformName = activePlatform === "all"
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
      currentAccounts.filter((account) => account.id !== accountId),
    );
    void loadPlatformPosts(activePlatform);
  };

  const handleConnect = async (platformId: PlatformId) => {
    setConnecting(platformId);
    setError("");

    try {
      // Fetch Zernio OAuth URL and log it for debugging
      const { url } = await accountApi.getAuthUrl(platformId);
      console.log(`Redirecting to Zernio Auth URL for ${platformId}:`, url);
      window.location.href = url;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Connection request failed. Please check backend server.");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6"
    >
      <motion.section variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Connected Accounts</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Connect social profiles, verify status, and keep publishing permissions healthy.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowPlatformPicker(true)}>
          Connect account
        </Button>
      </motion.section>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}
      {notice && !error && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">{notice}</p>
      )}
      {syncing && (
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500">
          Syncing connected accounts from Zernio...
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50 text-coral-700">
              <UsersRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">{accounts.length}</p>
              <p className="text-sm font-bold text-slate-500">Connected</p>
            </div>
          </div>
          </Card>
        </motion.div>
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Signal className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">{activePlatforms.length}</p>
              <p className="text-sm font-bold text-slate-500">Free platforms</p>
            </div>
          </div>
          </Card>
        </motion.div>
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">2.0</p>
              <p className="text-sm font-bold text-slate-500">Payments upcoming</p>
            </div>
          </div>
          </Card>
        </motion.div>
      </section>

      <motion.div variants={item}>
        <AccountGrid
          accounts={accounts}
          onConnectClick={() => setShowPlatformPicker(true)}
          onDisconnect={handleDisconnect}
        />
      </motion.div>

      <motion.section variants={item} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">Platform Posts</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              Review posts discovered from {activePlatformName} inside Sociora.
            </p>
          </div>
          <Button
            disabled={loadingPosts || accounts.length === 0}
            icon={<RefreshCw className={`h-4 w-4 ${loadingPosts ? "animate-spin" : ""}`} />}
            onClick={() => void loadPlatformPosts(activePlatform)}
            variant="secondary"
          >
            Refresh
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            className={`inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 text-sm font-black transition ${
              activePlatform === "all"
                ? "bg-slate-950 text-white shadow-sm shadow-slate-900/15"
                : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
            }`}
            disabled={loadingPosts}
            onClick={() => handlePlatformFilter("all")}
            type="button"
          >
            All platforms
          </button>
          {connectedPlatforms.map((platform) => (
            <button
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-black transition ${
                activePlatform === platform.id
                  ? "bg-slate-950 text-white shadow-sm shadow-slate-900/15"
                  : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
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

        {loadingPosts ? (
          <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500">
            Loading posts from {activePlatformName}...
          </p>
        ) : platformPosts.length === 0 ? (
          <EmptyState
            description="Connect accounts and refresh after Zernio syncs platform activity for the selected platform."
            icon={<MessageCircle className="h-5 w-5" />}
            title={`No posts from ${activePlatformName}`}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {platformPosts.map((post) => (
              <Card className="overflow-hidden p-4" key={`${post.platform}-${post.id}`}>
                {post.mediaUrl && (
                  <img
                    alt=""
                    className="mb-4 h-44 w-full rounded-lg object-cover"
                    src={post.mediaUrl}
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <PlatformBadge compact platformId={post.platform} />
                    <p className="mt-2 text-sm font-black text-slate-900">{post.accountName}</p>
                    <p className="text-xs font-bold text-slate-500">{formatPostDate(post.publishedAt)}</p>
                  </div>
                  {post.permalink && (
                    <Button
                      aria-label="Open platform post"
                      icon={<ExternalLink className="h-4 w-4" />}
                      onClick={() => window.open(post.permalink, "_blank", "noopener,noreferrer")}
                      size="icon"
                      variant="ghost"
                    />
                  )}
                </div>
                <p className="mt-4 line-clamp-4 text-sm font-semibold leading-6 text-slate-700">
                  {post.content || "No caption available for this post."}
                </p>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-black text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.commentCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {post.likeCount}
                  </span>
                  {post.isAd && <span className="text-amber-700">Ad</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.section>

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
