import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: ["Features", "Workflow", "Pricing", "Dashboard"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

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
          <pattern id="grid-footer" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-footer)" />
      </svg>

      {/* Radial glow at the bottom center */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, rgba(239,68,68,0.05) 40%, transparent 70%)",
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Footer() {
  return (
    <motion.footer 
      className="relative overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem] border-t border-slate-800 bg-slate-950"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="mb-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Link
            className="group mb-5 inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
              onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
              to="/"
            >
              <div className="flex flex-col">
                <span
                  className="
      text-3xl
      font-black
      italic
      leading-none
      tracking-tight
      bg-gradient-to-r
      from-red-500
      via-orange-500
      to-amber-500
      bg-clip-text
      text-transparent
      drop-shadow-sm
      select-none
    "
                  style={{
                    fontFamily:
                      "'Pacifico', 'Lobster', cursive",
                  }}
                >
                  Sociora
                </span>
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm font-semibold leading-7 text-slate-400">
              The AI social media workspace for planning, generating, scheduling, and reviewing campaigns from one responsive frontend.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3" />
              Ready to publish smarter?
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-300">
                {category}
              </div>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      className="inline-block text-sm font-semibold text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-orange-400" 
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-xs font-bold text-slate-500">
            Copyright {new Date().getFullYear()} Sociora. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a className="text-xs font-bold text-slate-400 transition hover:text-orange-400" href="#">
              Privacy Policy
            </a>
            <a className="text-xs font-bold text-slate-400 transition hover:text-orange-400" href="#">
              Terms of Service
            </a>
            <Link className="text-xs font-bold text-slate-400 transition hover:text-orange-400" to="/login">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
