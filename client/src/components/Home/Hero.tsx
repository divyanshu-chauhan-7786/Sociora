import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";

// ─── Social Icon SVGs ─────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// ─── Social Card data ─────────────────────────────────────────────────────────
const socialPlatforms = [
  { name: "Instagram", icon: InstagramIcon, color: "#E1306C", bg: "rgba(225,48,108,0.12)", followers: "24.3K", stat: "+12%" },
  { name: "Facebook", icon: FacebookIcon, color: "#1877F2", bg: "rgba(24,119,242,0.12)", followers: "18.7K", stat: "+8%" },
  { name: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2", bg: "rgba(10,102,194,0.12)", followers: "9.1K", stat: "+21%" },
  { name: "X / Twitter", icon: TwitterIcon, color: "#000000", bg: "rgba(0,0,0,0.1)", followers: "31.2K", stat: "+5%" },
];

// Positions for floating cards (desktop, relative to hero center)
const cardPositions = [
  { top: "20%",  left: "10%",  delay: 0,    duration: 5.2 },
  { top: "60%",  left: "8%",   delay: 0.8,  duration: 6.1 },
  { top: "25%", right: "10%", delay: 1.2,  duration: 5.5 },
  { top: "65%", right: "8%",  delay: 2.0,  duration: 6.3 },
];

// ─── FloatingCard ─────────────────────────────────────────────────────────────
function FloatingCard({
  platform,
  position,
  index,
}: {
  platform: (typeof socialPlatforms)[number];
  position: (typeof cardPositions)[number];
  index: number;
}) {
  const Icon = platform.icon;
  const { delay, duration, ...styleProps } = position;
  return (
    <motion.div
      className="absolute hidden h-12 w-12 cursor-default select-none items-center justify-center rounded-2xl border border-white/40 lg:flex"
      style={{
        ...styleProps,
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
        zIndex: 10,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -15, 5, -10, 0],
        x: [0, 8, -8, 6, 0],
        scale: 1,
        rotate: [0, 2, -2, 1, 0],
      }}
      transition={{
        opacity: { delay: 1 + index * 0.12, duration: 0.5 },
        scale:   { delay: 1 + index * 0.12, duration: 0.5 },
        y: {
          delay: delay,
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          delay: delay + 0.3,
          duration: duration + 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          delay: delay + 0.5,
          duration: duration + 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{ scale: 1.15, boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}
    >
      <div
        className="flex h-6 w-6 items-center justify-center"
        style={{ color: platform.color }}
      >
        <Icon />
      </div>
    </motion.div>
  );
}

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
          background: "radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, rgba(249,115,22,0.10) 35%, transparent 70%)",
        }}
      />

      {/* Top subtle glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

// ─── Ticker bar ────────────────────────────────────────────────────────────────
const tickerItems = [
  "Post scheduled for LinkedIn",
  "AI draft generated",
  "Engagement up 34%",
  "Campaign published",
  "Trending on TikTok",
  "18 accounts synced",
  "Best time detected: 4:15 PM",
];

function Ticker() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur py-3 px-0"
      style={{ 
        maskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)",
        WebkitMaskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)"
      }}
    >
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="text-xs font-semibold text-slate-500 px-4 py-1 bg-slate-100/80 rounded-full shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────────────────────────
export default function SocioraHero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const stagger: { container: Variants; item: Variants } = {
    container: { 
      initial: { opacity: 1 },
      animate: { transition: { staggerChildren: 0.13 } } 
    },
    item: {
      initial: { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
    },
  };

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      style={{ background: "#F8FAFC", fontFamily: "'DM Sans', 'Figtree', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');

        .grad-text {
          background: linear-gradient(92deg, #EF4444 0%, #F97316 50%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: linear-gradient(135deg, #EF4444 0%, #F97316 55%, #D97706 100%);
          box-shadow: 0 4px 24px rgba(239,68,68,0.28), 0 1px 0 rgba(255,255,255,0.2) inset;
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 36px rgba(239,68,68,0.38), 0 1px 0 rgba(255,255,255,0.2) inset;
        }
        .btn-primary:active { transform: translateY(0) scale(0.99); }

        .btn-secondary {
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          border-color: #F97316;
          color: #F97316;
        }

        .email-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(249,115,22,0.2); }

        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.5);opacity:0.6;} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <GridBackground />

      {/* Floating social cards */}
      {socialPlatforms.map((platform, i) => (
        <FloatingCard
          key={platform.name}
          platform={platform}
          position={cardPositions[i]}
          index={i}
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-14 pt-28 text-center sm:px-6 sm:pb-16 sm:pt-24">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center w-full"
        >
          {/* Headline */}
          <motion.h1
            variants={stagger.item}
            className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:mb-6 sm:text-6xl md:text-7xl lg:text-[82px]"
          >
            <span className="block">Sociora</span>
            <span className="grad-text block lg:inline">runs your content calendar.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={stagger.item}
            className="mb-8 max-w-[700px] text-base font-medium leading-7 text-slate-500 sm:mb-10 sm:text-xl sm:leading-relaxed"
          >
            Create AI-powered content, schedule across every platform, and manage your entire social workflow from one intelligent workspace.
          </motion.p>

          {/* CTA */}
          <motion.div variants={stagger.item} className="mb-4 w-full max-w-sm sm:max-w-md">
            <a
              href="/signup"
              className="btn-primary inline-flex items-center justify-center w-full rounded-2xl px-6 py-3.5 text-sm font-bold text-white no-underline"
            >
              Get started free
            </a>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={stagger.item} className="mb-10 flex w-full items-center justify-center sm:mb-14 sm:gap-4">
            <button
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-600 backdrop-blur"
              type="button"
              aria-label="Watch demo video"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                <svg className="w-3 h-3 text-slate-600 translate-x-0.5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5.5 3.5l7 4.5-7 4.5V3.5z"/>
                </svg>
              </span>
              Watch demo
            </button>
            <span className="hidden text-xs font-semibold text-slate-400 sm:inline">No credit card required</span>
          </motion.div>

          {/* Ticker */}
          <motion.div variants={stagger.item} className="w-full max-w-2xl">
            <Ticker />
          </motion.div>

        </motion.div>
      </div>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <h3 className="text-sm font-bold text-slate-200">Sociora Demo</h3>
                <button
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                  onClick={() => setIsVideoModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-slate-950">
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Demo Video"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
