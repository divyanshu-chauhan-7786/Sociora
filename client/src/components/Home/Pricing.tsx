import { motion } from "framer-motion";
import { Check, CircleCheckBig, Lock, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    badge: "Free Forever",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "forever",
    description: "Ideal for creators testing a streamlined social media workflow.",
    features: [
      "Instagram & LinkedIn Active",
      "10 Scheduled Posts / Month",
      "5 AI Caption Credits / Month",
      "Real-Time Account Health",
      "Unified Calendar View",
    ],
    cta: "Get Started Free",
    availability: "active",
    highlight: false,
    gradient: "from-teal-500/20 to-emerald-500/20",
    borderHover: "hover:border-teal-500/50",
    badgeColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
  },
  {
    name: "Pro Creator",
    badge: "Most Popular",
    priceMonthly: "$29",
    priceAnnual: "$23",
    period: "/month",
    description: "For creators & small teams needing AI captions, multi-channel & unlimited queues.",
    features: [
      "Instagram, LinkedIn, X & Facebook",
      "Unlimited Post Scheduling",
      "200 AI Caption Credits / Month",
      "Brand Tone Customization",
      "UPI, Net Banking & Cards",
      "Priority Queue Dispatch",
    ],
    cta: "Coming in 2.0 Launch",
    availability: "upcoming",
    highlight: true,
    gradient: "from-orange-500/20 to-amber-500/20",
    borderHover: "hover:border-orange-500/60",
    badgeColor: "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent",
  },
  {
    name: "Agency & Teams",
    badge: "Scale Tier",
    priceMonthly: "$79",
    priceAnnual: "$63",
    period: "/month",
    description: "For multi-brand agencies and businesses managing accounts at scale.",
    features: [
      "Everything in Pro Creator",
      "5 Dedicated Team Seats",
      "Unlimited AI Credits & Re-writes",
      "Multi-Brand Workspace Views",
      "GST Invoices & Team Billing",
      "Dedicated 24/7 Support SLA",
    ],
    cta: "Coming in 2.0 Launch",
    availability: "upcoming",
    highlight: false,
    gradient: "from-violet-500/20 to-purple-500/20",
    borderHover: "hover:border-violet-500/50",
    badgeColor: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  },
];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pricing" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pricing)" />
      </svg>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          width: "700px",
          height: "450px",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.4) 0%, rgba(13,148,136,0.3) 50%, transparent 80%)",
        }}
      />
    </div>
  );
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="relative overflow-hidden bg-transparent py-10 sm:py-14" id="pricing">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section with Compact Margins */}
        <motion.div
          className="mx-auto mb-8 sm:mb-10 max-w-3xl text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-teal-700 backdrop-blur-md dark:border-teal-400/30 dark:text-teal-300">
            <CircleCheckBig className="size-4 text-teal-600 dark:text-teal-400" />
            <span>Free Launch Active Today</span>
          </div>

          <h2 className="max-w-2xl text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Start free now, paid plans arrive with <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">Sociora 2.0</span>
          </h2>

          <p className="mt-3.5 max-w-2xl text-sm sm:text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Instagram, LinkedIn, Facebook, Twitter / X, and YouTube are active today completely free for all creators and teams.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/80 p-1.5 shadow-lg backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-xs font-black transition-all duration-300 ${
                !isAnnual
                  ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black transition-all duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border p-7 sm:p-8 backdrop-blur-2xl transition-all duration-500 ${
                  plan.highlight
                    ? "border-orange-500/50 bg-slate-950/90 dark:bg-slate-900/95 text-white shadow-2xl shadow-orange-500/15"
                    : "border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 text-slate-950 dark:text-white shadow-xl hover:shadow-2xl"
                } ${plan.borderHover}`}
              >
                {/* Top Glowing Ambient Orb */}
                <div
                  className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${plan.gradient} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Highlight Badge Top Banner */}
                {plan.highlight && (
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500" />
                )}

                <div>
                  {/* Badge & Plan Name */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {plan.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${plan.badgeColor}`}
                    >
                      {plan.highlight && <Sparkles className="h-3 w-3" />}
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                      {price}
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {plan.period}
                    </span>
                    {isAnnual && price !== "$0" && (
                      <span className="ml-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        (Billed annually)
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300 mb-6">
                    {plan.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px w-full bg-slate-200/80 dark:bg-white/10 mb-6" />

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs sm:text-sm font-bold">
                        <div
                          className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                            plan.highlight
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  {plan.availability === "active" ? (
                    <Link
                      to="/login"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35 active:translate-y-0"
                    >
                      <Zap className="h-4 w-4" />
                      <span>{plan.cta}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={`inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                        plan.highlight
                          ? "bg-white/10 text-slate-300 border border-white/10"
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/5"
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                      <span>{plan.cta}</span>
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
