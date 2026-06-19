import { Request, Response } from "express";
import User from "../models/User.js";
import WorkspaceSettings from "../models/WorkspaceSettings.js";
import { uploadToImageKit } from "../services/imageKit.js";
import { presentUser } from "../utils/presenters.js";

const defaultSettings = {
  timezone: "Asia/Kolkata",
  brandVoice: "Always maintain a professional but approachable tone. Avoid buzzwords like 'synergy' or 'disrupt'. Use max 2-3 emojis per post.",
  publishing: {
    urlShortening: true,
    approvalWorkflow: false,
  },
  notifications: {
    postFailAlerts: true,
    weeklyDigest: true,
  },
};

export const getSettings = async (req: Request | any, res: Response): Promise<void> => {
  const settings = await WorkspaceSettings.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id, ...defaultSettings } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.json({
    profile: presentUser(req.user),
    workspace: {
      timezone: settings.timezone,
      brandVoice: settings.brandVoice,
      publishing: settings.publishing,
      notifications: settings.notifications,
    },
  });
};

export const updateSettings = async (req: Request | any, res: Response): Promise<void> => {
  const { profile, workspace } = req.body;

  if (profile) {
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        name: profile.name,
        role: profile.role,
        company: profile.company,
        bio: profile.bio,
      },
    }, { runValidators: true });
  }

  await WorkspaceSettings.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: {
        timezone: workspace?.timezone,
        brandVoice: workspace?.brandVoice,
        publishing: workspace?.publishing,
        notifications: workspace?.notifications,
      },
      $setOnInsert: { user: req.user._id },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

  const user = await User.findById(req.user._id).select("-password");
  req.user = user;
  await getSettings(req, res);
};

const parseDataUrlImage = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/);

  if (!match) {
    throw new Error("Upload a PNG, JPG, JPEG, or WEBP image.");
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
};

const extensionFromMime = (mimeType: string) => {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
};

export const updateProfilePhoto = async (req: Request | any, res: Response): Promise<void> => {
  const { imageData } = req.body;

  if (!imageData || typeof imageData !== "string") {
    res.status(400).json({ message: "imageData is required" });
    return;
  }

  let parsedImage: ReturnType<typeof parseDataUrlImage>;

  try {
    parsedImage = parseDataUrlImage(imageData);
  } catch (error: any) {
    res.status(400).json({ message: error?.message ?? "Invalid image upload." });
    return;
  }

  const { buffer, mimeType } = parsedImage;
  const maxBytes = 5 * 1024 * 1024;

  if (buffer.byteLength > maxBytes) {
    res.status(400).json({ message: "Profile photo must be 5MB or smaller." });
    return;
  }

  const upload = await uploadToImageKit({
    buffer,
    fileName: `profile-${req.user._id.toString()}-${Date.now()}.${extensionFromMime(mimeType)}`,
    folder: `/sociora/profile-photos/${req.user._id.toString()}`,
    mimeType,
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { profileImageUrl: upload.url } },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ profile: presentUser(user) });
};
