import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-slate-100/60 to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30 transition-colors duration-500" />

      {/* Floating Glowing Orb 1 - Coral/Orange */}
      <motion.div
        animate={{
          x: [0, 90, -70, 0],
          y: [0, -110, 60, 0],
          scale: [1, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-coral-400/35 via-orange-400/25 to-pink-500/20 blur-[130px] dark:from-coral-600/25 dark:via-orange-600/20 dark:to-pink-700/15"
      />

      {/* Floating Glowing Orb 2 - Teal/Emerald */}
      <motion.div
        animate={{
          x: [0, -100, 80, 0],
          y: [0, 120, -90, 0],
          scale: [1, 0.8, 1.25, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -right-36 h-[650px] w-[650px] rounded-full bg-gradient-to-tl from-teal-400/35 via-emerald-400/25 to-cyan-500/20 blur-[150px] dark:from-teal-600/30 dark:via-emerald-700/20 dark:to-cyan-800/15"
      />

      {/* Floating Glowing Orb 3 - Indigo/Purple */}
      <motion.div
        animate={{
          x: [0, 110, -90, 0],
          y: [0, 100, -120, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-48 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-400/30 via-purple-400/25 to-blue-500/20 blur-[140px] dark:from-indigo-600/25 dark:via-purple-700/20 dark:to-blue-800/15"
      />

      {/* Floating Glowing Orb 4 - Amber/Rose Warmth */}
      <motion.div
        animate={{
          x: [0, -80, 70, 0],
          y: [0, -90, 100, 0],
          scale: [1, 1.25, 0.8, 1],
        }}
        transition={{
          duration: 27,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-2/3 -left-28 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-amber-300/25 via-orange-300/20 to-rose-400/15 blur-[120px] dark:from-amber-600/20 dark:via-orange-700/15 dark:to-rose-800/15"
      />

      {/* Subtle Dot Grid Mask */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:28px_28px] opacity-35 dark:opacity-25 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" 
      />

      {/* Light shimmer sweep */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-t from-transparent via-teal-100/10 to-transparent dark:via-teal-900/10 pointer-events-none"
      />
    </div>
  );
}
