import { motion, type Variants } from "framer-motion";
import { CheckCircle2, PlugZap, Sparkles, TimerReset } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Connect accounts",
    description:
      "Authorize Instagram and LinkedIn, monitor connection health, and keep paid channels clearly marked for 2.0.",
    icon: PlugZap,
    color: "text-teal-600 bg-teal-50",
    details: ["OAuth status", "Profile sync", "Free channels active"],
  },
  {
    step: "02",
    title: "Generate and refine",
    description:
      "Draft campaign copy with AI, adjust tone, and keep every caption ready for review before it enters the queue.",
    icon: Sparkles,
    color: "text-coral-600 bg-coral-50",
    details: ["AI captions", "Tone controls", "Media-ready drafts"],
  },
  {
    step: "03",
    title: "Schedule with clarity",
    description:
      "Set date, time, media, and channels from one composer while the dashboard keeps the queue easy to scan.",
    icon: TimerReset,
    color: "text-amber-600 bg-amber-50",
    details: ["Queue status", "Manual publish", "Dashboard visibility"],
  },
];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid-how" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-how)" />
      </svg>
    </div>
  );
}

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

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center"
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
            Workflow
          </motion.div>
          <h2 className="max-w-2xl text-4xl font-black leading-snug text-slate-950 sm:text-5xl">
            A clean operating flow for every campaign.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            Sociora keeps account setup, AI drafting, and scheduling in a tight workspace built for daily content operations.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-5 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.step}
                variants={itemVariants}
                className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 sm:p-7"
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 35px rgba(15,23,42,0.08)",
                  borderColor: "rgba(20,184,166,0.35)",
                }}
              >
                <motion.div
                  className="absolute inset-x-0 top-0 z-20 h-1 origin-left bg-[linear-gradient(90deg,#0f766e,#f97316)]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="relative z-10 mb-6 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    {item.step}
                  </span>
                  <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-black uppercase text-slate-500">
                    Step {index + 1}
                  </span>
                </div>

                <motion.div
                  className={`relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                <div className="relative z-10 flex flex-1 flex-col">
                  <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                    {item.details.map((detail) => (
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600" key={detail}>
                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
