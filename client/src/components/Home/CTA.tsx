import { motion } from "framer-motion";
import { ArrowRightIcon, CalendarCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function CTA() {
  return (
    <section className="relative bg-white py-24 z-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="group relative overflow-hidden rounded-[2rem] border border-slate-800 p-8 text-white shadow-2xl shadow-slate-900/20 sm:p-12 lg:p-16 transition-colors duration-500 hover:border-teal-500/30"
        >
          {/* Background Gradients & Glows */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_56%,#134e4a_100%)]" />
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[100px] transition-all duration-700 group-hover:bg-teal-500/30 group-hover:blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[100px] transition-all duration-700 group-hover:bg-orange-500/20" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <motion.div variants={itemVariants}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-2 text-sm font-black uppercase text-teal-300 backdrop-blur-sm">
                <Sparkles className="size-4" />
                Ready to publish smarter?
              </div>
              <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Build your next social campaign inside Sociora.
              </h2>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-300">
                Move from scattered notes to generated drafts, scheduled posts, and a clear publishing queue.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:min-w-[300px]">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-6 text-base font-black text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/40"
                  to="/login"
                >
                  Get started free
                  <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-base font-black text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/30"
                  href="#pricing"
                >
                  <CalendarCheck className="h-5 w-5 opacity-70 transition group-hover:opacity-100" />
                  Compare plans
                </a>
              </motion.div>
              <p className="mt-1 text-center text-sm font-bold text-slate-400">
                No credit card required
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
