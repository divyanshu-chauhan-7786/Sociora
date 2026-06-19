import { CalendarClock, CheckCircle2, Layers3, UsersRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
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
    dashboardApi.get()
      .then((nextDashboard) => {
        setDashboard(nextDashboard);
        setError("");
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Dashboard failed to load"))
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

  // Show loader until real data comes through
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral-500 border-t-transparent" />
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
    failed: 0,
    publishingHealth: 0,
  };
  const upcomingPosts = dashboard?.upcomingPosts ?? [];
  const activities = dashboard?.activities ?? [];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6 sm:space-y-8"
    >
      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Hero Section */}
        <motion.div variants={item} className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent blur-3xl" />
          <div className="relative z-10">
            <Badge tone="brand" className="mb-4 shadow-sm shadow-red-500/10">AI-powered publishing</Badge>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Good morning, {user?.name ?? "there"}.
              <br className="hidden sm:block" /> Your content engine is ready.
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Review queued posts, connect more channels, and use AI Composer to turn ideas into polished platform-ready content.
            </p>
          </div>
        </motion.div>

        {/* Publishing Health Meter */}
        <motion.div variants={item} className="h-full">
          <Card className="relative flex h-full flex-col justify-center overflow-hidden p-6 sm:p-8 rounded-[1.5rem]">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Publishing Health</p>
              <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-950 dark:text-white">{stats.publishingHealth}%</p>
                <p className="text-sm font-bold text-green-500">Live</p>
              </div>
            </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600 ring-1 ring-green-500/20 shadow-inner dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/10">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </div>
            <div className="relative z-10 mt-8 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className={`h-full rounded-full transition-all duration-1000 ${getHealthColor(stats.publishingHealth)}`} style={{ width: `${stats.publishingHealth}%` }} />
          </div>
            <p className="relative z-10 mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {stats.failed === 0 ? "All queued content looks healthy." : (
                <span><span className="font-bold text-red-500 dark:text-red-400">{stats.failed} failed post{stats.failed > 1 ? "s" : ""}</span> need attention.</span>
              )}
          </p>
          </Card>
        </motion.div>
      </section>

      {/* Stats Cards */}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-coral-50 text-coral-700 ring-1 ring-coral-600/10"
            icon={CalendarClock}
            label="Scheduled Posts"
            trend="+2 this week"
            value={stats.scheduled}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-teal-50 text-teal-700 ring-1 ring-teal-600/10"
            icon={CheckCircle2}
            label="Published Posts"
            trend="+18% reach"
            value={stats.published}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-amber-50 text-amber-700 ring-1 ring-amber-600/10"
            icon={UsersRound}
            label="Connected Accounts"
            trend="3 healthy"
            value={stats.connectedAccounts}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            accentClass="bg-slate-50 text-slate-600 ring-1 ring-slate-500/10"
            icon={Layers3}
            label="Drafts"
            trend="Ready to refine"
            value={stats.drafts}
          />
        </motion.div>
      </section>

      {/* Bottom Section */}
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={item} className="h-full">
          <Card className="flex h-full flex-col overflow-hidden rounded-[1.5rem]">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">Upcoming Queue</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                The next scheduled posts across platforms.
              </p>
            </div>
            <Badge tone="neutral" className="hidden sm:inline-flex">{upcomingPosts.length} pending</Badge>
          </div>
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <div key={post.id} className="group relative px-6 py-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
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
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-500">No upcoming posts in the queue.</p>
              </div>
            )}
          </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="h-full">
          <ActivityTimeline activities={activities} />
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
