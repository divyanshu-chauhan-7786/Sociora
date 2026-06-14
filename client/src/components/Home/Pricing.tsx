import { motion, type Variants } from "framer-motion";
import { CheckIcon, CircleCheckBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For creators testing a cleaner scheduling workflow.",
    features: ["2 social accounts", "10 scheduled posts/month", "5 AI credits/month", "Basic dashboard"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For teams that want AI writing and unlimited scheduling.",
    features: ["Unlimited accounts", "Unlimited scheduling", "200 AI credits/month", "Priority support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    description: "For multi-brand teams managing content at scale.",
    features: ["Everything in Pro", "5 team seats", "Unlimited AI credits", "Custom AI personas"],
    cta: "Contact sales",
    highlight: false,
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
          <pattern id="grid-pricing" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pricing)" />
      </svg>

      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, rgba(236,72,153,0.04) 35%, transparent 70%)",
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
      staggerChildren: 0.15,
      delayChildren: 0.2,
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

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-24" id="pricing">
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
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black uppercase text-violet-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CircleCheckBigIcon className="size-4" />
            Simple pricing
          </motion.div>
          <h2 className="max-w-2xl text-4xl font-black leading-snug text-slate-950 sm:text-5xl">
            Start lean, upgrade when your content calendar grows.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            Transparent plans for solo creators, growing teams, and agencies. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3 md:items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {pricingPlans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={itemVariants}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border p-8 shadow-sm transition-all duration-300 ${
                plan.highlight
                  ? "border-slate-900 bg-slate-950 text-white shadow-xl shadow-slate-900/20"
                  : "border-slate-200/50 bg-white/70 text-slate-950 backdrop-blur-sm"
              }`}
              whileHover={{
                y: -8,
                boxShadow: plan.highlight 
                    ? "0 20px 40px rgba(15,23,42,0.3)" 
                    : "0 20px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
                borderColor: plan.highlight ? "rgba(249,115,22,0.5)" : "rgba(139,92,246,0.3)",
              }}
            >
              {/* Top gradient bar on hover */}
              <motion.div
                className={`absolute inset-x-0 top-0 h-1 origin-left z-20 ${
                  plan.highlight 
                    ? "bg-[linear-gradient(90deg,#ef4444,#f97316,#d97706)]"
                    : "bg-[linear-gradient(90deg,#8b5cf6,#a855f7,#ec4899)]"
                }`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              {plan.highlight && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 py-1.5 text-xs font-black text-white shadow-md">
                  Most popular
                </div>
              )}

              <div className="relative z-10 mt-2 flex flex-1 w-full flex-col gap-6">
                <div>
                  <div className={`mb-3 text-sm font-black uppercase tracking-wide ${plan.highlight ? "text-orange-400" : "text-violet-600"}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`mb-1.5 text-sm font-bold ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-4 text-sm font-semibold leading-6 ${plan.highlight ? "text-slate-300" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-2 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li className="flex items-center gap-3 text-sm font-bold" key={feature}>
                      <div className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlight ? "bg-orange-500/20 text-orange-400" : "bg-violet-100 text-violet-600"
                      }`}>
                        <CheckIcon className="h-3 w-3" />
                      </div>
                      <span className={plan.highlight ? "text-slate-200" : "text-slate-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                  <Link
                    className={`flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-black transition-colors ${
                      plan.highlight
                        ? "bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                    to="/login"
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
