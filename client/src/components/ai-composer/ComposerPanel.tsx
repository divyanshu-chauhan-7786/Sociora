import { Image, Loader2, Sparkles } from "lucide-react";

import type { Tone } from "../../types";
import { Button } from "../ui/Button";

interface ComposerPanelProps {
  prompt: string;
  tone: Tone;
  generateImage: boolean;
  loading: boolean;
  tones: Tone[];
  onPromptChange: (value: string) => void;
  onToneChange: (value: Tone) => void;
  onToggleImage: () => void;
  onGenerate: () => void;
}

export const ComposerPanel = ({
  prompt,
  tone,
  generateImage,
  loading,
  tones,
  onPromptChange,
  onToneChange,
  onToggleImage,
  onGenerate,
}: ComposerPanelProps) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
    <div className="border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral-50 text-coral-700">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-black text-slate-950">Create with AI</h2>
          <p className="text-sm font-semibold text-slate-500">
            Brief Sociora once, then schedule the best result.
          </p>
        </div>
      </div>
    </div>

    <div className="p-4">
      <textarea
        className="min-h-44 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder="Example: Write a launch post for a new AI social media scheduler, with a confident but helpful tone."
        value={prompt}
      />

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Tone</span>
          <select
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => onToneChange(event.target.value as Tone)}
            value={tone}
          >
            {tones.map((toneOption) => (
              <option key={toneOption} value={toneOption}>
                {toneOption}
              </option>
            ))}
          </select>
        </label>

        <button
          aria-pressed={generateImage}
          className="flex h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
          onClick={onToggleImage}
          type="button"
        >
          <span className="inline-flex items-center gap-2">
            <Image className="h-4 w-4 text-coral-600" />
            AI image
          </span>
          <span
            className={`relative h-6 w-10 rounded-full transition ${generateImage ? "bg-teal-600" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${generateImage ? "left-5" : "left-1"}`}
            />
          </span>
        </button>

        <Button
          className="border-0 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 dark:shadow-none"
          disabled={!prompt.trim() || loading}
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          onClick={onGenerate}
          size="lg"
        >
          {loading ? "Generating" : "Generate"}
        </Button>
      </div>
    </div>
  </div>
);
