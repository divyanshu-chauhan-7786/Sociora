import { Request, Response } from "express";
import Generation from "../models/Generation.js";
import WorkspaceSettings from "../models/WorkspaceSettings.js";
import { generateHashtagSuggestions, generateSocialDraft } from "../services/googleAi.js";
import { presentGeneration } from "../utils/presenters.js";
import { recordActivity } from "../utils/activity.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

const toneValues = ["Professional", "Casual", "Friendly", "Bold", "Inspirational", "Witty"] as const;

export const listGenerations = async (req: Request | any, res: Response): Promise<void> => {
  const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(generations.map(presentGeneration));
};

export const createGeneration = async (req: Request | any, res: Response): Promise<void> => {
  const { prompt, tone = "Professional", generateImage = false } = req.body;

  if (!prompt?.trim()) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }

  const settings = await WorkspaceSettings.findOne({ user: req.user._id });
  const brandVoice = settings?.brandVoice ?? "Professional but approachable.";
  const draft = await generateSocialDraft({
    prompt: prompt.trim(),
    tone,
    brandVoice,
    generateImage,
    userId: req.user._id.toString(),
  });

  const generation = await Generation.create({
    user: req.user._id,
    prompt: prompt.trim(),
    tone,
    content: draft.content,
    mediaUrl: draft.mediaUrl,
  });

  await recordActivity({
    user: req.user._id.toString(),
    type: "generated",
    title: "AI content generated",
    description: `Created a ${tone.toLowerCase()} draft from AI Composer.`,
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { generationId: generation._id.toString(), status: "generated" });

  res.status(201).json(presentGeneration(generation));
};

export const updateGeneration = async (req: Request | any, res: Response): Promise<void> => {
  const { prompt, content, tone } = req.body;
  const updates: Record<string, string> = {};

  if (prompt !== undefined) {
    if (!String(prompt).trim()) {
      res.status(400).json({ message: "Prompt cannot be empty" });
      return;
    }

    updates.prompt = String(prompt).trim();
  }

  if (content !== undefined) {
    if (!String(content).trim()) {
      res.status(400).json({ message: "Generated content cannot be empty" });
      return;
    }

    updates.content = String(content).trim();
  }

  if (tone !== undefined) {
    if (!toneValues.includes(tone)) {
      res.status(400).json({ message: "Unsupported tone" });
      return;
    }

    updates.tone = tone;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: "No generation updates provided" });
    return;
  }

  const generation = await Generation.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!generation) {
    res.status(404).json({ message: "Generated content not found" });
    return;
  }

  await recordActivity({
    user: req.user._id.toString(),
    type: "generated",
    title: "AI draft edited",
    description: "Updated a generated draft from AI Composer.",
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { generationId: generation._id.toString(), status: "updated" });

  res.json(presentGeneration(generation));
};

export const deleteGeneration = async (req: Request | any, res: Response): Promise<void> => {
  const generation = await Generation.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!generation) {
    res.status(404).json({ message: "Generated content not found" });
    return;
  }

  await recordActivity({
    user: req.user._id.toString(),
    type: "generated",
    title: "AI draft deleted",
    description: "Removed a generated draft from AI Composer.",
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { generationId: generation._id.toString(), status: "deleted" });

  res.status(204).send();
};

export const suggestHashtags = async (req: Request | any, res: Response): Promise<void> => {
  const { content, platforms = [] } = req.body;

  if (!content?.trim()) {
    res.status(400).json({ message: "Content is required before generating hashtags" });
    return;
  }

  if (!Array.isArray(platforms)) {
    res.status(400).json({ message: "Platforms must be a list" });
    return;
  }

  const settings = await WorkspaceSettings.findOne({ user: req.user._id });
  const hashtags = await generateHashtagSuggestions({
    content: content.trim(),
    platforms,
    brandVoice: settings?.brandVoice ?? "Professional but approachable.",
  });

  res.json({ hashtags });
};
