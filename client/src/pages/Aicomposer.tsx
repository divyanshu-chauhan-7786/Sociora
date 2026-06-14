import { History, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";

import { ComposerPanel } from "../components/ai-composer/ComposerPanel";
import { GenerationCard } from "../components/ai-composer/GenerationCard";
import { SchedulePostModal } from "../components/scheduler/SchedulePostModal";
import { EmptyState } from "../components/ui/EmptyState";
import { mockGenerations, mockPosts } from "../constants/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Generation, ScheduledPost, Tone } from "../types";

const tones: Tone[] = [
  "Professional",
  "Casual",
  "Friendly",
  "Bold",
  "Inspirational",
  "Witty",
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const createGeneratedContent = (prompt: string, tone: Tone) =>
  `${tone} draft for your audience:\n\n${prompt.trim()}\n\nTurn this into a focused post with a clear hook, practical value, and a simple call to action. Sociora can refine this into platform-specific versions before publishing.`;

const Aicomposer = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useLocalStorage<Generation[]>(
    "sociora.ai.generations",
    mockGenerations,
  );
  const [, setPosts] = useLocalStorage<ScheduledPost[]>("sociora.scheduler.posts", mockPosts);
  const [activeScheduler, setActiveScheduler] = useState<Generation | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      const generated: Generation = {
        id: `generation-${crypto.randomUUID()}`,
        prompt,
        content: createGeneratedContent(prompt, tone),
        tone,
        createdAt: new Date().toISOString(),
        mediaUrl: generateImage ? mockGenerations[generations.length % mockGenerations.length]?.mediaUrl : undefined,
      };

      setGenerations((currentGenerations) => [generated, ...currentGenerations]);
      setPrompt("");
      setLoading(false);
    }, 650);
  };

  const handleSchedule = (post: ScheduledPost) => {
    setPosts((currentPosts) => [post, ...currentPosts]);
    setActiveScheduler(null);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6"
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_0.55fr]">
        <motion.div variants={item}>
          <ComposerPanel
            generateImage={generateImage}
            loading={loading}
            onGenerate={handleGenerate}
            onPromptChange={setPrompt}
            onToggleImage={() => setGenerateImage((value) => !value)}
            onToneChange={setTone}
            prompt={prompt}
            tone={tone}
            tones={tones}
          />
        </motion.div>

        <motion.div variants={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/40">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-slate-100">Prompt assistant</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Strong prompts include product context, target audience, platform, tone, offer, and desired call to action.
          </p>
          <div className="mt-5 space-y-2 text-sm font-bold text-slate-600">
            <motion.button
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-slate-50 p-3 text-left transition hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-teal-500/10 dark:hover:text-teal-300"
              onClick={() => setPrompt("Create a LinkedIn post announcing Sociora's AI scheduling workflow for busy marketing teams.")}
              type="button"
            >
              Launch announcement
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-slate-50 p-3 text-left transition hover:bg-coral-50 hover:text-coral-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-coral-500/10 dark:hover:text-coral-300"
              onClick={() => setPrompt("Write an Instagram caption for a carousel about planning a calm weekly content calendar.")}
              type="button"
            >
              Instagram carousel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-slate-50 p-3 text-left transition hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
              onClick={() => setPrompt("Draft a YouTube community post promoting a new tutorial about repurposing long-form videos.")}
              type="button"
            >
              YouTube promotion
            </motion.button>
          </div>
        </motion.div>
      </section>

      <section>
        <motion.div variants={item} className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Generated Content</h2>
          </div>
          <span className="text-sm font-semibold text-slate-400">{generations.length} drafts</span>
        </motion.div>

        {generations.length === 0 ? (
          <motion.div variants={item}>
            <EmptyState
              description="Create your first AI draft to see generated posts, image previews, and scheduling actions here."
              icon={<Sparkles className="h-5 w-5" />}
              title="No generations yet"
            />
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {generations.map((generation) => (
              <motion.div variants={item} key={generation.id}>
                <GenerationCard
                  generation={generation}
                  onSchedule={setActiveScheduler}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {activeScheduler && (
        <SchedulePostModal
          generation={activeScheduler}
          onClose={() => setActiveScheduler(null)}
          onSchedule={handleSchedule}
        />
      )}
    </motion.div>
  );
};

export default Aicomposer;
