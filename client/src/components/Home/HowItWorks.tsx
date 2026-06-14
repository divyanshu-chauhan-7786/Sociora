import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, PlugZap, Sparkles, TimerReset } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Connect accounts",
    description:
      "Bring your social profiles into one workspace and see connection status before anything is scheduled.",
    icon: PlugZap,
    color: "text-teal-600 bg-teal-50",
  },
  {
    step: "02",
    title: "Generate and refine",
    description:
      "Use the AI composer to create captions, rewrite tone, and prepare campaign content for each platform.",
    icon: Sparkles,
    color: "text-coral-600 bg-coral-50",
  },
  {
    step: "03",
    title: "Schedule with clarity",
    description:
      "Choose date, time, media, and channels, then keep your publishing queue visible from the dashboard.",
    icon: TimerReset,
    color: "text-amber-600 bg-amber-50",
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
          <pattern id="grid-how" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-how)" />
      </svg>

      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.04) 35%, transparent 70%)",
        }}
      />

      {/* Top subtle glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(8,145,178,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-24" id="how-it-works">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-black uppercase text-teal-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CheckCircle2 className="size-4" />
            Simple setup
          </motion.div>
          <h2 className="max-w-2xl text-4xl font-black leading-snug text-slate-950 sm:text-5xl">
            Three calm steps to launch campaigns.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            The interface keeps the workflow obvious: connect, create, and publish without extra screens fighting for attention.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.article
                key={item.step}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 flex flex-col"
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
                  borderColor: "rgba(6,182,212,0.5)",
                }}
              >
                {/* Top gradient bar on hover */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-1 origin-left bg-[linear-gradient(90deg,#06b6d4,#0891b2,#8b5cf6)] z-20"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Floating background glow */}
                <div
                  className="absolute -inset-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl z-0"
                  style={{
                    background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
                  }}
                />

                {/* Step number and arrow */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-slate-300 transition-colors">
                    {item.step}
                  </span>
                  {!isLast && (
                    <motion.div
                      className="hidden lg:block"
                      whileHover={{ x: 6 }}
                    >
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-teal-500 transition-colors duration-300" />
                    </motion.div>
                  )}
                </div>

                {/* Icon */}
                <motion.div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-xl ${item.color} mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 flex-1">
                    {item.description}
                  </p>
                  <motion.a
                    href="#"
                    className="mt-4 inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 gap-2"
                    whileHover={{ x: 4 }}
                  >
                    Learn more →
                  </motion.a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
