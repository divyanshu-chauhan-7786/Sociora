import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 1.427-.016 2.67-.309 3.699-.867 1.2-.65 2.116-1.724 2.698-3.063.54-1.255.766-2.697.668-4.298-.098-1.584-.508-2.895-1.218-3.898-.685-.97-1.662-1.634-2.907-1.974 0 0-.016.001-.022.001-.207 3.018-1.266 5.116-3.027 6.194-1.174.711-2.616.979-4.304.797-1.46-.16-2.676-.76-3.514-1.74-.851-1-.263-2.166-.263-2.166s.025-.037.075-.086c.3-.291 1.043-.705 2.397-.705.8 0 1.649.14 2.522.416v-.001c.063.02.127.04.189.063v.008c.063.018.127.04.19.059v.003c.063.018.126.038.187.059v.001c.066.022.13.044.193.066v.001c.01.003.02.007.03.01h.001c.048.015.091.033.135.05h.002c.046.016.09.034.133.053.018.007.035.014.053.02.064.024.127.05.19.078h.001c.046.019.09.04.134.061.016.007.032.015.048.022.062.028.122.058.182.09l.003.002c.04.02.08.042.12.065.013.007.026.014.039.022.063.035.125.072.186.11.01.006.018.013.027.018.061.038.12.078.178.12.007.005.015.01.022.016.065.046.129.094.192.144.005.005.01.009.016.013.067.053.133.108.198.165.003.003.006.006.01.009.064.056.127.114.19.175.002.002.004.004.006.006.063.062.126.125.187.19l.003.003c.06.065.12.132.178.2.001.001.002.003.004.004.059.07.117.142.173.215v.002c.055.073.108.148.16.225v.001c.052.077.102.155.15.234l.002.003c.048.08.094.161.137.244l.003.005c.04.08.08.162.117.244l.003.007c.038.084.073.168.107.253l.002.005c.033.086.064.172.093.258l.001.004c.03.087.057.175.081.263 0 0 .001.003.002.005.025.09.047.18.066.27 0 .001.001.003.001.005.019.089.036.18.05.27 0 .001 0 .003.001.004.014.092.025.183.034.275v.004c.009.091.015.182.019.274v.003c.004.093.004.185.002.277v.004c-.002.092-.007.184-.015.275 0 .001 0 .003-.001.004-.007.09-.017.18-.03.269-.001.002-.001.004-.001.006-.012.09-.027.178-.044.267 0 .001-.001.003-.001.005-.018.088-.037.176-.059.263-.001.003-.002.006-.003.009-.021.085-.045.17-.071.254-.002.006-.004.012-.006.018-.025.083-.052.165-.081.246-.003.009-.006.018-.01.026-.028.079-.059.157-.091.235-.004.01-.009.02-.013.03-.033.074-.068.148-.105.22-.005.01-.01.021-.015.03-.037.072-.077.142-.118.212-.006.011-.012.021-.018.031-.04.068-.084.136-.128.203-.007.011-.015.021-.022.031-.046.066-.094.13-.143.194-.009.011-.017.023-.026.034-.05.063-.102.124-.155.184-.011.013-.022.026-.033.038-.053.059-.108.117-.165.173-.014.014-.028.029-.042.043-.059.057-.12.112-.181.166-.016.015-.033.029-.049.043-.064.054-.13.106-.197.156-.019.014-.037.029-.056.042-.069.05-.14.099-.213.145-.02.014-.042.027-.063.04-.079.05-.16.097-.242.142-.022.013-.045.026-.067.038-.087.047-.175.09-.265.13-.025.012-.05.023-.075.034-.092.04-.187.079-.284.115-.024.009-.048.018-.073.027-.098.035-.199.068-.302.097-.023.007-.046.013-.07.02-.107.03-.217.057-.327.082-.019.005-.038.009-.057.013-.114.025-.23.047-.347.066-.016.003-.033.005-.049.007-.12.02-.242.036-.365.049-.012.001-.023.003-.035.004-.124.013-.25.022-.376.029h-.01c-.126.006-.252.01-.379.01h-.013c-.128 0-.255-.003-.382-.009h-.012c-.126-.006-.252-.015-.377-.027-.013-.001-.026-.003-.039-.004-.122-.013-.244-.029-.365-.048-.018-.003-.036-.005-.054-.008-.118-.019-.234-.04-.349-.065-.02-.005-.041-.009-.061-.014-.112-.025-.222-.053-.331-.083-.025-.007-.049-.014-.073-.021-.103-.03-.204-.063-.303-.098-.025-.009-.05-.019-.075-.028-.097-.037-.192-.076-.284-.117-.025-.011-.05-.023-.075-.034-.09-.041-.178-.084-.265-.13-.021-.011-.042-.023-.064-.035-.082-.045-.163-.091-.241-.14-.023-.014-.045-.028-.067-.042-.072-.046-.142-.094-.21-.144-.022-.015-.043-.031-.064-.047-.065-.049-.13-.1-.193-.153-.02-.016-.039-.033-.058-.049-.062-.053-.122-.108-.18-.164-.018-.018-.037-.036-.055-.054-.056-.055-.11-.113-.162-.172-.016-.019-.032-.038-.049-.056-.051-.061-.1-.124-.148-.188-.014-.019-.029-.037-.043-.057-.047-.066-.092-.133-.136-.201-.012-.019-.024-.038-.036-.057-.044-.07-.085-.142-.124-.215-.01-.02-.02-.04-.031-.059-.039-.076-.076-.152-.11-.229-.008-.019-.016-.038-.024-.057-.036-.08-.069-.16-.1-.241-.006-.018-.013-.036-.019-.054-.032-.086-.061-.172-.087-.26-.004-.016-.009-.032-.013-.048-.027-.093-.05-.186-.07-.28-.002-.013-.005-.026-.007-.039-.02-.098-.037-.196-.05-.295-.001-.012-.003-.024-.004-.036-.013-.101-.022-.203-.028-.305 0-.01-.001-.02-.001-.03-.005-.101-.007-.203-.005-.305z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
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
function FloatingCard({ platform, position, index }) {
  const Icon = platform.icon;
  const { delay, duration, ...styleProps } = position;
  return (
    <motion.div
      className="absolute flex items-center justify-center h-12 w-12 rounded-2xl border border-white/40 cursor-default select-none"
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
  "🚀 Post scheduled for LinkedIn",
  "✨ AI draft generated",
  "📊 Engagement up 34%",
  "🗓️ Campaign published",
  "🔥 Trending on TikTok",
  "✅ 18 accounts synced",
  "⚡ Best time detected: 4:15 PM",
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

  const stagger = {
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
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
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
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 pt-24 pb-16 max-w-4xl mx-auto w-full">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center w-full"
        >
          {/* Headline */}
          <motion.h1
            variants={stagger.item}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-black leading-[1.01] tracking-tight text-slate-950 mb-6"
          >
            <span className="block">Sociora</span>
            <span className="grad-text block lg:inline">runs your content calendar.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={stagger.item}
            className="max-w-[700px] text-lg sm:text-xl font-medium leading-relaxed text-slate-500 mb-10"
          >
            Create AI-powered content, schedule across every platform, and manage your entire social workflow from one intelligent workspace.
          </motion.p>

          {/* CTA */}
          <motion.div variants={stagger.item} className="w-full max-w-md mb-4">
            <a
              href="/signup"
              className="btn-primary inline-flex items-center justify-center w-full rounded-2xl px-6 py-3.5 text-sm font-bold text-white no-underline"
            >
              Get started free →
            </a>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={stagger.item} className="flex items-center gap-4 mb-14">
            <button
              className="btn-secondary inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-600 backdrop-blur"
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
            <span className="text-xs font-semibold text-slate-400">No credit card required</span>
          </motion.div>

          {/* Ticker */}
          <motion.div variants={stagger.item} className="w-full max-w-2xl">
            <Ticker />
          </motion.div>

          {/* Mobile social icons row */}
          <motion.div variants={stagger.item} className="mt-10 flex lg:hidden flex-wrap justify-center gap-2">
            {socialPlatforms.map((p) => {
              const Icon = p.icon;
              return (
                <span
                  key={p.name}
                  className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur"
                  style={{ borderColor: p.color + "33" }}
                >
                  <span style={{ color: p.color }}>
                    <Icon />
                  </span>
                  {p.name}
                </span>
              );
            })}
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