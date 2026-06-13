import { motion } from "framer-motion";
import { Star, StarIcon } from "lucide-react";

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
          background: "radial-gradient(ellipse, rgba(250,115,85,0.06) 0%, rgba(251,191,36,0.04) 35%, transparent 70%)",
        }}
      />

      {/* Top subtle glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const testimonials = [
  {
    name: "Sarah K.",
    role: "Marketing Manager",
    avatar: "S",
    avatarBg: "bg-[linear-gradient(135deg,#fb7185,#f97316)]",
    text: "Sociora saves our team 10+ hours a week. The AI composer gets close to our brand voice before the first edit.",
  },
  {
    name: "Marcus L.",
    role: "Indie Creator",
    avatar: "M",
    avatarBg: "bg-[linear-gradient(135deg,#14b8a6,#22c55e)]",
    text: "I used to dread planning posts. Now I queue a week of content in one sitting and still know what is going live.",
  },
  {
    name: "Priya D.",
    role: "Startup Founder",
    avatar: "P",
    avatarBg: "bg-[linear-gradient(135deg,#f59e0b,#ef4444)]",
    text: "The dashboard is beautiful, but more importantly it is clear. Our launch posts finally feel organized.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-white py-24" id="testimonials">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black uppercase text-amber-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StarIcon className="size-4" />
            Customer stories
          </motion.div>
          <h2 className="max-w-2xl text-4xl font-black leading-snug text-slate-950 sm:text-5xl">
            Teams love the workflow clarity.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            Sociora is designed for everyday repetition: scan the queue, generate better drafts, and move content forward without friction.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 flex flex-col min-h-80"
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
                borderColor: "rgba(250,115,85,0.5)",
              }}
            >
              {/* Top gradient bar on hover */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1 origin-left bg-[linear-gradient(90deg,#f97316,#fb7185,#fbbf24)] z-20"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Floating background glow */}
              <div
                className="absolute -inset-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl z-0"
                style={{
                  background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Stars */}
                <motion.div
                  className="mb-5 flex gap-1 text-amber-400"
                  whileHover={{ scale: 1.05 }}
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star className="h-4 w-4 fill-current" key={starIndex} />
                  ))}
                </motion.div>

                {/* Testimonial Text */}
                <p className="flex-1 text-sm font-semibold leading-7 text-slate-600">
                  "{testimonial.text}"
                </p>

                {/* Author Section */}
                <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                  <motion.div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${testimonial.avatarBg}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="text-sm font-black text-slate-950">{testimonial.name}</div>
                    <div className="text-xs font-bold text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
