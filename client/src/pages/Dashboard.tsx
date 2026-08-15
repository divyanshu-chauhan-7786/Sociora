import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Edit3,
  Layers3,
  Plus,
  Send,
  Sparkles,
  Trash2,
  UsersRound,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { AnalyticsCharts } from "../components/dashboard/AnalyticsCharts";
import { DashboardWidgets } from "../components/dashboard/DashboardWidgets";
import { StatsCard } from "../components/dashboard/StatsCard";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PlatformBadge } from "../components/ui/PlatformBadge";
import { useAuth } from "../hooks/useAuth";
import { dashboardApi, realtimeApi, type DashboardResponse } from "../lib/api";
import { formatSchedule } from "../utils/date";

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

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingActivity, setIsClearingActivity] = useState(false);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const nextDashboard = await dashboardApi.get();
      setDashboard(nextDashboard);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Dashboard failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    dashboardApi
      .get()
      .then((nextDashboard) => {
        setDashboard(nextDashboard);
        setError("");
      })
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "Dashboard failed to load")
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const url = realtimeApi.getUrl();

    if (!url) {
      return;
    }

    const events = new EventSource(url);
    const refresh = () => void loadDashboard();

    events.addEventListener("dashboard:changed", refresh);
    events.addEventListener("activity:changed", refresh);
    events.onerror = () => {
      events.close();
    };

    return () => {
      events.removeEventListener("dashboard:changed", refresh);
      events.removeEventListener("activity:changed", refresh);
      events.close();
    };
  }, [loadDashboard]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadDashboard();
    }, 20_000);

    return () => window.clearInterval(interval);
  }, [loadDashboard]);

  const handleClearActivity = async () => {
    const confirmed = window.confirm("Reset the activity feed for this workspace?");

    if (!confirmed) {
      return;
    }

    setIsClearingActivity(true);
    setError("");

    try {
      await dashboardApi.clearActivity();
      setDashboard((currentDashboard) =>
        currentDashboard ? { ...currentDashboard, activities: [] } : currentDashboard
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Activity feed could not be reset");
    } finally {
      setIsClearingActivity(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-[linear-gradient(90deg,#22c55e,#10b981)] shadow-[0_0_10px_rgba(34,197,94,0.4)]";
    if (health >= 50) return "bg-[linear-gradient(90deg,#f59e0b,#fbbf24)] shadow-[0_0_10px_rgba(245,158,11,0.4)]";
    return "bg-[linear-gradient(90deg,#ef4444,#f97316)] shadow-[0_0_10px_rgba(249,115,22,0.4)]";
  };

  const stats = dashboard?.stats ?? {
    scheduled: 0,
    published: 0,
    connectedAccounts: 0,
    drafts: 0,
    aiDrafts: 0,
    failed: 0,
    publishingHealth: 0,
  };
  const upcomingPosts = dashboard?.upcomingPosts ?? [];
  const activities = dashboard?.activities ?? [];

  // Filter posts by platform
  const filteredUpcomingPosts =
    selectedPlatformFilter === "all"
      ? upcomingPosts
      : upcomingPosts.filter((p) => p.platforms.includes(selectedPlatformFilter as any));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6 sm:space-y-8"
    >
      {/* Next-Gen Hero Banner with Quick Actions */}
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] items-stretch">
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
        >
          {/* Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-tr from-teal-500/15 via-emerald-500/5 to-transparent blur-2xl" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" />
                AI Content Engine Active
              </span>

              {/* Live Time Clock */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>{currentTime || "Live IST"}</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">IST</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">{user?.name ?? "Creator"}</span>.
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
              Your social publishing engine is synchronized across 4 active channels. Draft ideas, monitor health, and publish with total confidence.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="relative z-10 mt-6 pt-6 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center gap-3">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Link>

            <Link
              to="/ai-composer"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 backdrop-blur-md transition-all duration-300 hover:bg-orange-500/20 hover:border-orange-500/50"
            >
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>AI Caption Draft</span>
            </Link>

            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Calendar className="h-4 w-4 text-teal-500" />
              <span>Open Calendar</span>
            </Link>
          </div>
        </motion.div>

        {/* Publishing Health Meter Card */}
        <motion.div variants={item} className="h-full">
          <Card className="relative flex h-full flex-col justify-between overflow-hidden p-7 sm:p-8 rounded-[2.2rem]">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Publishing Health</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-950 dark:text-white">{stats.publishingHealth}%</p>
                  <p className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live</p>
                </div>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 shadow-inner dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/10">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            </div>

            <div className="relative z-10 mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getHealthColor(stats.publishingHealth)}`}
                style={{ width: `${stats.publishingHealth}%` }}
              />
            </div>

            <p className="relative z-10 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stats.failed === 0 ? (
                "All OAuth platform channels are healthy & ready."
              ) : (
                <span>
                  <span className="font-bold text-red-500 dark:text-red-400">
                    {stats.failed} failed post{stats.failed > 1 ? "s" : ""}
                  </span>{" "}
                  need attention.
                </span>
              )}
            </p>
          </Card>
        </motion.div>
      </section>

      {/* Interactive Bento Stats Cards */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20"
            icon={CalendarClock}
            label="Scheduled Posts"
            trend="+2 queued this week"
            value={stats.scheduled}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20"
            icon={CheckCircle2}
            label="Published Posts"
            trend="+18% reach"
            value={stats.published}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"
            icon={UsersRound}
            label="Connected Accounts"
            trend="3 healthy OAuth"
            value={stats.connectedAccounts}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20"
            icon={Layers3}
            label="Drafts & Ideas"
            trend="Ready for AI review"
            value={stats.drafts}
          />
        </motion.div>
      </section>

      {/* 4 Visual Interactive Graphs / Charts Section */}
      <motion.div variants={item}>
        <AnalyticsCharts analytics={dashboard?.analytics} />
      </motion.div>

      {/* Connected Accounts Live Status Bar & AI Recommendations Widget */}
      <motion.div variants={item}>
        <DashboardWidgets analytics={dashboard?.analytics} />
      </motion.div>

      {/* Upcoming Queue with Actions & Platform Filter */}
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <motion.div variants={item} className="h-full">
          <Card className="flex h-full flex-col overflow-hidden rounded-[2rem]">
            {/* Header with Platform Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/30">
              <div>
                <h2 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <span>Upcoming Queue</span>
                  <Badge tone="neutral">{filteredUpcomingPosts.length} pending</Badge>
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Scheduled posts across connected channels.
                </p>
              </div>

              {/* Platform Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                {["all", "instagram", "linkedin", "facebook", "twitter"].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setSelectedPlatformFilter(plat)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      selectedPlatformFilter === plat
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {plat === "twitter" ? "X" : plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Items */}
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
              {filteredUpcomingPosts.length > 0 ? (
                filteredUpcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative px-6 py-5 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50 flex flex-col justify-between gap-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.platforms.map((platform) => (
                          <PlatformBadge compact key={platform} platformId={platform} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                        {formatSchedule(post.scheduledDate, post.scheduledTime)}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                      {post.content}
                    </p>

                    {/* Quick Actions */}
                    <div className="mt-1 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => alert(`Dispatching post "${post.id}" now!`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[11px] font-black text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-colors"
                        title="Publish immediately"
                      >
                        <Send className="h-3 w-3" />
                        <span>Publish Now</span>
                      </button>

                      <Link
                        to="/scheduler"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Edit post draft"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => alert(`Post "${post.id}" removed from queue.`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Delete from queue"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-sm font-semibold text-slate-500">No upcoming posts found for this filter.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="h-full">
          <ActivityTimeline
            activities={activities}
            isClearing={isClearingActivity}
            onClear={handleClearActivity}
          />
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
