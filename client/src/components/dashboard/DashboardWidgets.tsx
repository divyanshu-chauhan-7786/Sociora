import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flame, Lightbulb, Link2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardResponse } from "../../lib/api";

interface DashboardWidgetsProps {
  analytics?: DashboardResponse["analytics"];
}

export function DashboardWidgets({ analytics }: DashboardWidgetsProps) {
  const channelStatuses = analytics?.channelStatuses ?? [
    { platform: "instagram", name: "Instagram", status: "Active", isHealthy: true, handle: "" },
    { platform: "linkedin", name: "LinkedIn", status: "Active", isHealthy: true, handle: "" },
    { platform: "facebook", name: "Facebook", status: "Active", isHealthy: true, handle: "" },
    { platform: "twitter", name: "X / Twitter", status: "Connect", isHealthy: false, handle: "" },
  ];

  const getIcon = (platform: string) => {
    if (platform.includes("insta")) return "📸";
    if (platform.includes("link")) return "💼";
    if (platform.includes("face")) return "👥";
    return "🐦";
  };

  const healthyCount = channelStatuses.filter((c) => c.isHealthy).length;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
      {/* Widget 1: Connected Channels Live Status Bar */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Link2 className="h-4.5 w-4.5 text-orange-500" />
                <span>Connected Accounts Status</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time channel OAuth tokens & publishing health from database & Zernio
              </p>
            </div>
            <Link
              to="/accounts"
              className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors"
            >
              <span>Manage Accounts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {channelStatuses.map((channel) => (
              <div
                key={channel.name}
                className={`flex items-center justify-between rounded-2xl border ${
                  channel.isHealthy ? "border-emerald-500/20" : "border-amber-500/20"
                } bg-slate-50/70 dark:bg-white/[0.03] p-3.5 backdrop-blur-md transition-all hover:bg-slate-100/70 dark:hover:bg-white/[0.06]`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{getIcon(channel.platform)}</span>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{channel.name}</div>
                    <div
                      className={`text-[11px] font-bold ${
                        channel.isHealthy
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {channel.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      channel.isHealthy ? "bg-emerald-500" : "bg-amber-500"
                    } animate-pulse`}
                  />
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    {channel.isHealthy ? "LIVE" : "SYNC"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {healthyCount} Accounts 100% Healthy
          </span>
          <span className="text-[11px]">Auto Token Refresh Active</span>
        </div>
      </motion.div>

      {/* Widget 2: AI Smart Recommendations Box */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-[1.8rem] border border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-teal-500/5 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-teal-500/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950 dark:text-white">AI Content Recommendations</h3>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Smart timing & viral hook suggestions</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-black text-slate-950 dark:text-white mb-1">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Best Post Timing Today</span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                Optimal engagement slot today is <span className="font-bold text-orange-600 dark:text-orange-400">6:30 PM - 8:00 PM IST</span> for Instagram & LinkedIn.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-black text-slate-950 dark:text-white mb-1">
                <Flame className="h-4 w-4 text-red-500" />
                <span>Trending Topic Prompt</span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-red-600 dark:text-red-400">"AI Workflow Rituals"</span> is trending (+42% engagement). Generate a caption now.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-orange-500/20 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">⚡ Real-time Sync Active</span>
          <Link
            to="/ai-composer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-xs font-black text-white shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Draft Caption Now</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
