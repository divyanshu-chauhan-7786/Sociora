import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, StarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
          <pattern id="grid-testimonials" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-testimonials)" />
      </svg>

      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(250,115,85,0.08) 0%, rgba(251,191,36,0.05) 35%, transparent 70%)",
        }}
      />

      {/* Top subtle glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Head of Marketing @ ZestyMedia",
    location: "Mumbai, MH",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
    text: "Sociora has completely automated our campaign planning. We save over 15 hours every week on client content approval and scheduling across Instagram & LinkedIn.",
    rating: 5,
    tag: "Agency Lead",
  },
  {
    name: "Priya Deshmukh",
    role: "Founder & Creative Director",
    location: "Bengaluru, KA",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    text: "The AI draft generation in Sociora matches our brand tone perfectly. Being able to review and publish to all 4 channels from one unified calendar is a game changer.",
    rating: 5,
    tag: "E-Com Founder",
  },
  {
    name: "Rohan Mehta",
    role: "Growth Marketer @ TechPulse",
    location: "Gurgaon, HR",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    text: "Managing 8+ brand accounts used to be chaotic. Sociora's real-time account health monitoring and draft queue keep our entire marketing team 100% synchronized.",
    rating: 5,
    tag: "Growth Lead",
  },
  {
    name: "Ananya Verma",
    role: "Social Media Strategist",
    location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    text: "Sociora's AI caption composer generates incredible hooks and platform-specific variations. Our organic engagement rates jumped 40% in just two months!",
    rating: 5,
    tag: "Content Strategist",
  },
  {
    name: "Vikramaditya Singh",
    role: "Co-Founder @ CraftLogic",
    location: "Pune, MH",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    text: "The UI is insanely sleek and fast. Our entire team adopted Sociora on day one. Queueing a month of posts takes under an hour now.",
    rating: 5,
    tag: "SaaS Founder",
  },
  {
    name: "Kavya Patel",
    role: "Digital Brand Lead @ Elevate",
    location: "Ahmedabad, GJ",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    text: "From post previewing to automated timing suggestions, Sociora gives us complete control without any platform login hassles. Highly recommended!",
    rating: 5,
    tag: "Brand Lead",
  },
  {
    name: "Rajesh Iyer",
    role: "Performance Lead @ AdVibe",
    location: "Hyderabad, TS",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
    text: "We switched our entire agency workflow from legacy tools to Sociora. The speed, clarity, and AI writing capabilities are unmatched for growing teams.",
    rating: 5,
    tag: "Agency Director",
  },
  {
    name: "Neha Kapoor",
    role: "Independent Creator & Influencer",
    location: "Jaipur, RJ",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80",
    text: "As a solo creator, keeping up with daily posts across Instagram, YouTube, and X was exhausting. Sociora acts like my personal 24/7 AI social assistant.",
    rating: 5,
    tag: "Solo Creator",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll active card into view smoothly
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 380;
      scrollRef.current.scrollTo({
        left: activeIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="relative overflow-hidden bg-transparent py-24" id="testimonials">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mx-auto mb-12 max-w-3xl text-center flex flex-col items-center">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 backdrop-blur-md dark:border-teal-400/30 dark:text-teal-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <StarIcon className="size-4 text-teal-600 dark:text-teal-400 fill-teal-600/20" />
            Customer Stories from India
          </motion.div>

          <h2 className="max-w-2xl text-4xl font-black leading-snug text-slate-950 dark:text-white sm:text-5xl">
            Loved by creators & agencies across India.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Discover how creators, founders, and social media teams use Sociora to plan, generate, schedule, and publish content effortlessly.
          </p>

          {/* Slider Controls */}
          <div className="mt-8 flex items-center justify-between w-full max-w-md bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg">
            <button
              onClick={handlePrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-all hover:bg-orange-500 hover:text-white active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-7 bg-gradient-to-r from-orange-500 to-amber-500"
                      : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-all hover:bg-orange-500 hover:text-white active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Animated Marquee & Interactive Cards Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden py-4"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.article
                  key={item.name}
                  className={`group relative flex-none w-[340px] sm:w-[380px] snap-center overflow-hidden rounded-[2.2rem] border p-7 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between ${
                    isActive
                      ? "border-orange-500/50 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-orange-500/15 scale-[1.02]"
                      : "border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 shadow-lg hover:border-orange-500/30"
                  }`}
                >
                  {/* Accent Top Gradient Line */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500" />

                  {/* Watermark Quote Icon */}
                  <Quote className="absolute right-6 top-6 h-12 w-12 text-slate-200/40 dark:text-slate-800/40 pointer-events-none" />

                  <div>
                    {/* Tag & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {item.tag}
                      </span>
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star className="h-3.5 w-3.5 fill-current" key={i} />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200 italic mb-6">
                      "{item.text}"
                    </p>
                  </div>

                  {/* Author Profile with Indian Avatar */}
                  <div className="flex items-center gap-3.5 border-t border-slate-100 dark:border-white/10 pt-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-500/40 shadow-md flex-none"
                    />
                    <div>
                      <div className="text-sm font-black text-slate-950 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {item.role}
                      </div>
                      <div className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                        📍 {item.location}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
