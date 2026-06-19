import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  CalendarClock,
  ImagePlus,
  Layers3,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

// Import local assets
import imgUnifiedQueue from "../../assets/PublishingQueue.png"; 
import imgAiDrafts from "../../assets/contentdrafts.png";
import imgVisualPreviews from "../../assets/VisualCompagin.png";
import imgMultiPlatform from "../../assets/Multiplatform.png";
import imgPerformance from "../../assets/PerformanceSnapshot.png";
import imgAccountHealth from "../../assets/AccountHealth.png";

const features = [
  {
    title: "Unified publishing queue",
    description:
      "Plan every channel from one calendar with clear statuses, platform badges, and edit-ready cards.",
    icon: CalendarClock,
    accent: "bg-coral-50 text-coral-600",
    image: imgUnifiedQueue,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "AI content drafts",
    description:
      "Turn a short campaign brief into polished captions that feel ready for approval, copy, or scheduling.",
    icon: MessageSquareText,
    accent: "bg-teal-50 text-teal-600",
    image: imgAiDrafts,
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Visual campaign previews",
    description:
      "Pair generated copy with media previews so your posts feel complete before they enter the queue.",
    icon: ImagePlus,
    accent: "bg-amber-50 text-amber-600",
    image: imgVisualPreviews,
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Multi-platform workflow",
    description:
      "Coordinate Instagram, Facebook, LinkedIn, X, and YouTube without jumping between tools.",
    icon: Layers3,
    accent: "bg-slate-100 text-slate-700",
    image: imgMultiPlatform,
    className: "md:col-span-1 lg:col-span-2",
  },
  {
    title: "Performance snapshot",
    description:
      "Scan scheduled, published, connected, and generated activity from a clean operator dashboard.",
    icon: BarChart3,
    accent: "bg-emerald-50 text-emerald-600",
    image: imgPerformance,
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Account health",
    description:
      "Spot connected, syncing, and disconnected profiles before important campaign posts go live.",
    icon: ShieldCheck,
    accent: "bg-orange-50 text-orange-600",
    image: imgAccountHealth,
    className: "md:col-span-2 lg:col-span-1",
  },
];

// ─── GridBackground ────────────────────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* dot/grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, rgba(34,197,94,0.04) 35%, transparent 70%)",
        }}
      />

      {/* Top subtle glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

// ─── Container Variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24" id="features">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-coral-200 bg-coral-50 px-4 py-2 text-sm font-black uppercase text-coral-700 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Layers3 className="size-4" />
            Core features
          </motion.div>
          <h2 className="max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl sm:leading-snug">
            A fast, focused workspace for modern teams.
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-500 sm:mt-6 sm:text-base sm:leading-7">
            Sociora brings planning, AI writing, scheduling, and account visibility into a responsive interface built for repeat daily use.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 xl:gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={itemVariants}
                className={`group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:min-h-[480px] sm:rounded-[2.5rem] sm:shadow-xl ${feature.className || ""}`}
                whileHover={{
                  y: -10,
                  scale: 1.01,
                  boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15), 0 0 40px rgba(14,165,233,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
                  borderColor: "rgba(14,165,233,0.4)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Top gradient bar on hover */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-1.5 origin-center bg-[linear-gradient(90deg,#0ea5e9,#06b6d4,#10b981)] z-20"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Floating background glow */}
                <div
                  className="absolute -inset-10 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 blur-3xl z-0"
                  style={{
                    background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
                  }}
                />

                {/* Subtle glass reflection on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />

                {/* Content (Top) */}
                <div className="relative z-20 flex flex-col p-5 pb-0 sm:p-10 sm:pb-0">
                  <div className="mb-3 flex items-center gap-4 sm:mb-5">
                    <div className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md sm:flex ${feature.accent}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{feature.title}</h3>
                  </div>
                  <p className="max-w-xl text-sm font-semibold leading-6 text-slate-500 transition-colors duration-300 group-hover:text-slate-600 sm:text-base sm:leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image (Bottom) */}
                <div className="relative z-10 mt-6 flex flex-1 items-end justify-center overflow-hidden px-4 pt-4 sm:mt-10 sm:px-10 sm:pt-6">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-auto w-full rounded-t-lg object-cover object-top shadow-[0_-8px_30px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:-translate-y-2 sm:rounded-t-2xl"
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
