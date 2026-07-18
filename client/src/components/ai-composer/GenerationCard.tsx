import { CalendarPlus, Copy, Hash, Image, Pencil, RotateCcw, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { Generation, Tone } from "../../types";
import { formatDate } from "../../utils/date";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface GenerationCardProps {
  generation: Generation;
  tones: Tone[];
  onDelete: (generation: Generation) => Promise<void>;
  onSchedule: (generation: Generation) => void;
  onSuggestHashtags: (generation: Generation) => Promise<string[]>;
  onUpdate: (generation: Generation, payload: { prompt: string; content: string; tone: Tone }) => Promise<void>;
  onUsePrompt: (generation: Generation) => void;
}

export const GenerationCard = ({
  generation,
  tones,
  onDelete,
  onSchedule,
  onSuggestHashtags,
  onUpdate,
  onUsePrompt,
}: GenerationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(generation.content);
  const [draftPrompt, setDraftPrompt] = useState(generation.prompt);
  const [draftTone, setDraftTone] = useState<Tone>(generation.tone);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const characterCount = isEditing ? draftContent.length : generation.content.length;
  const countTone = characterCount > 280 ? "text-amber-600" : "text-slate-400";

  const resetDraft = () => {
    setDraftContent(generation.content);
    setDraftPrompt(generation.prompt);
    setDraftTone(generation.tone);
  };

  const handleCancel = () => {
    resetDraft();
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onUpdate(generation, {
        prompt: draftPrompt,
        content: draftContent,
        tone: draftTone,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this generated draft?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(generation);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuggestHashtags = async () => {
    setIsGeneratingHashtags(true);

    try {
      const suggestedHashtags = await onSuggestHashtags(generation);
      setHashtags(suggestedHashtags);
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const handleAddHashtags = async () => {
    if (hashtags.length === 0) {
      return;
    }

    const hashtagText = hashtags.join(" ");
    const nextContent = generation.content.includes(hashtagText)
      ? generation.content
      : `${generation.content.trim()}\n\n${hashtagText}`;

    setIsSaving(true);

    try {
      await onUpdate(generation, {
        prompt: generation.prompt,
        content: nextContent,
        tone: generation.tone,
      });
      setHashtags([]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
      {generation.mediaUrl ? (
        <img
          alt=""
          className="h-44 w-full object-cover"
          src={generation.mediaUrl}
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-[linear-gradient(135deg,#fff1f2,#f0fdfa)] text-slate-400">
          <Image className="h-7 w-7" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          {isEditing ? (
            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
              onChange={(event) => setDraftTone(event.target.value as Tone)}
              value={draftTone}
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          ) : (
            <Badge tone="brand">{generation.tone}</Badge>
          )}
          <time className="text-xs font-semibold text-slate-400">
            {formatDate(generation.createdAt)}
          </time>
        </div>

        {isEditing ? (
          <div className="mt-3 flex flex-1 flex-col gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-400">Prompt</span>
              <textarea
                className="min-h-20 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold leading-5 text-slate-800 outline-none focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                onChange={(event) => setDraftPrompt(event.target.value)}
                value={draftPrompt}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-400">Content</span>
              <textarea
                className="min-h-40 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-800 outline-none focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                onChange={(event) => setDraftContent(event.target.value)}
                value={draftContent}
              />
            </label>
          </div>
        ) : (
          <p className="mt-3 line-clamp-6 flex-1 text-sm font-semibold leading-6 text-slate-700">
            {generation.content}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-black">
          <span className={countTone}>{characterCount} characters</span>
          {characterCount <= 280 ? (
            <span className="text-teal-600">Short-post friendly</span>
          ) : (
            <span className="text-amber-600">Better for LinkedIn/caption</span>
          )}
        </div>

        {!isEditing && hashtags.length > 0 && (
          <div className="mt-3 rounded-lg border border-teal-100 bg-teal-50/60 p-3">
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((hashtag) => (
                <span key={hashtag} className="rounded-full bg-white px-2 py-1 text-xs font-black text-teal-700 shadow-sm">
                  {hashtag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                className="flex-1"
                disabled={isSaving}
                icon={<Save className="h-4 w-4" />}
                onClick={handleAddHashtags}
                size="sm"
                variant="secondary"
              >
                Add
              </Button>
              <Button
                icon={<X className="h-4 w-4" />}
                onClick={() => setHashtags([])}
                size="sm"
                variant="ghost"
              >
                Hide
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
          {isEditing ? (
            <>
              <Button
                disabled={isSaving || !draftContent.trim() || !draftPrompt.trim()}
                icon={<Save className="h-4 w-4" />}
                onClick={handleSave}
                variant="secondary"
              >
                {isSaving ? "Saving" : "Save"}
              </Button>
              <Button
                disabled={isSaving}
                icon={<X className="h-4 w-4" />}
                onClick={handleCancel}
                variant="ghost"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={<Copy className="h-4 w-4" />}
                onClick={() => void navigator.clipboard.writeText(generation.content)}
                variant="secondary"
              >
                Copy
              </Button>
              <Button
                className="border-0 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 dark:shadow-none"
                icon={<CalendarPlus className="h-4 w-4" />}
                onClick={() => onSchedule(generation)}
              >
                Schedule
              </Button>
              <Button
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => setIsEditing(true)}
                variant="ghost"
              >
                Edit
              </Button>
              <Button
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={() => onUsePrompt(generation)}
                variant="ghost"
              >
                Reuse
              </Button>
              <Button
                disabled={isGeneratingHashtags}
                icon={<Hash className="h-4 w-4" />}
                onClick={handleSuggestHashtags}
                variant="secondary"
              >
                {isGeneratingHashtags ? "Thinking" : "Hashtags"}
              </Button>
              <Button
                disabled={isDeleting}
                icon={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
                variant="danger"
              >
                {isDeleting ? "Deleting" : "Delete draft"}
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
