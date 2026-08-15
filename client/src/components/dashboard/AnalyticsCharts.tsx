import { motion } from "framer-motion";
import { BarChart3, Clock, LineChart, PieChart, Sparkles, TrendingUp } from "lucide-react";
import type { DashboardResponse } from "../../lib/api";

interface AnalyticsChartsProps {
  analytics?: DashboardResponse["analytics"];
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  const totalReach = analytics?.totalReach ?? "0";
  const reachGrowth = analytics?.reachGrowth ?? "0%";
  const hoursSaved = analytics?.hoursSaved ?? "0.0 Hrs Saved";
  const postsPerWeek = analytics?.postsPerWeek ?? "0 Posts / Wk";

  const defaultWeeklyBars = [
    { day: "M", count: 0, height: "15%", active: false },
    { day: "T", count: 0, height: "15%", active: false },
    { day: "W", count: 0, height: "15%", active: true },
    { day: "T", count: 0, height: "15%", active: false },
    { day: "F", count: 0, height: "15%", active: false },
    { day: "S", count: 0, height: "15%", active: false },
    { day: "S", count: 0, height: "15%", active: false },
  ];

  const weeklyBars = analytics?.weeklyBars && analytics.weeklyBars.length === 7
    ? analytics.weeklyBars
    : defaultWeeklyBars;

  const share = analytics?.platformShare ?? {
    instagram: 0,
    linkedin: 0,
    facebook: 0,
    twitter: 0,
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <LineChart className="h-5 w-5 text-orange-500" />
            <span>Workspace Analytics & Growth</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Real-time multi-channel performance metrics & velocity breakdown.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
          <Sparkles className="h-3 w-3 text-teal-500" />
          Live Backend Sync
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Graph 1: Reach & Impressions Growth (Area Chart) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Reach & Impressions
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> {reachGrowth}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">{totalReach}</div>
            <p className="text-[11px] font-semibold text-slate-400">Total reach across connected channels</p>
          </div>

          {/* SVG Area Chart */}
          <div className="mt-4 h-24 w-full relative">
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,50 Q 30,40 60,45 T 120,20 T 170,15 L 200,8 L 200,60 L 0,60 Z"
                fill="url(#reachGradient)"
              />
              <path
                d="M 0,50 Q 30,40 60,45 T 120,20 T 170,15 L 200,8"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="200" cy="8" r="4" fill="#f97316" className="animate-ping opacity-75" />
              <circle cx="200" cy="8" r="4" fill="#f97316" />
            </svg>
          </div>
        </motion.div>

        {/* Graph 2: Weekly Publishing Velocity (Bar Chart) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-teal-500" /> Velocity
              </span>
              <span className="text-xs font-black text-teal-600 dark:text-teal-400">
                {postsPerWeek}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">Publishing Cadence</div>
            <p className="text-[11px] font-semibold text-slate-400">Mon - Sun queue dispatch</p>
          </div>

          {/* Dynamic Bar Chart */}
          <div className="mt-4 flex items-end justify-between gap-1.5 h-24 pt-4 border-t border-slate-100 dark:border-white/5">
            {weeklyBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/bar">
                <div
                  style={{ height: bar.height }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    bar.active
                      ? "bg-gradient-to-t from-teal-600 to-teal-400 shadow-md shadow-teal-500/20"
                      : "bg-slate-200 dark:bg-slate-800 group-hover/bar:bg-teal-500/50"
                  }`}
                  title={`${bar.count ?? 0} posts`}
                />
                <span className="text-[10px] font-black text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Graph 3: Audience & Platform Share (Donut Chart) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-amber-500" /> Platform Share
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                Live Data
              </span>
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">Channel Share</div>
            <p className="text-[11px] font-semibold text-slate-400">Post distribution split</p>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {/* SVG Donut Chart */}
            <div className="relative h-20 w-20 flex-none">
              <svg viewBox="0 0 36 36" className="h-full w-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="4.5" strokeDasharray={`${share.instagram} 100`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="4.5" strokeDasharray={`${share.linkedin} 100`} strokeDashoffset={`-${share.instagram}`} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray={`${share.facebook} 100`} strokeDashoffset={`-${share.instagram + share.linkedin}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-700 dark:text-slate-200">
                100%
              </div>
            </div>

            {/* Dynamic Legend */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-slate-600 dark:text-slate-300">Insta {share.instagram}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="text-slate-600 dark:text-slate-300">LinkedIn {share.linkedin}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">FB {share.facebook}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">X {share.twitter}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Graph 4: AI Time Saved & Efficiency */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-[1.8rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-violet-500" /> AI Efficiency
              </span>
              <span className="text-xs font-black text-violet-600 dark:text-violet-400">
                {hoursSaved}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">Time Automation</div>
            <p className="text-[11px] font-semibold text-slate-400">AI caption generation efficiency</p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              <span>Workflow Efficiency</span>
              <span className="text-violet-600 dark:text-violet-400">88% Optimal</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 p-0.5">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "88%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 shadow-sm"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Avg 4 mins per caption</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">⚡ 4x Faster</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
