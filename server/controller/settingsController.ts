import { Request, Response } from "express";
import User from "../models/User.js";
import WorkspaceSettings from "../models/WorkspaceSettings.js";
import { uploadToImageKit } from "../services/imageKit.js";
import { presentUser } from "../utils/presenters.js";
import { broadcastToUser } from "../utils/realtime.js";

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

const getOrCreateWorkspaceSettings = (userId: string) =>
  WorkspaceSettings.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, ...defaultSettings } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

const presentSettingsResponse = (user: any, settings: any) => ({
  profile: presentUser(user),
  workspace: {
    timezone: settings.timezone,
    brandVoice: settings.brandVoice,
    publishing: settings.publishing,
    notifications: settings.notifications,
  },
});

export const getSettings = async (req: Request | any, res: Response): Promise<void> => {
  const settings = await getOrCreateWorkspaceSettings(req.user._id.toString());
  res.json(presentSettingsResponse(req.user, settings));
};

export const updateSettings = async (req: Request | any, res: Response): Promise<void> => {
  const { profile, workspace } = req.body;

  if (profile) {
    const profileUpdates: Record<string, string> = {};

    if (profile.name !== undefined) {
      if (typeof profile.name !== "string" || !profile.name.trim()) {
        res.status(400).json({ message: "Name is required" });
        return;
      }

      profileUpdates.name = profile.name.trim();
    }

    for (const field of ["role", "company", "bio"] as const) {
      if (profile[field] !== undefined) {
        if (typeof profile[field] !== "string") {
          res.status(400).json({ message: `${field} must be text` });
          return;
        }

        profileUpdates[field] = profile[field].trim();
      }
    }

    if (Object.keys(profileUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: profileUpdates,
      }, { runValidators: true });
    }
  }

  const workspaceUpdates: Record<string, string | boolean> = {};

  if (workspace) {
    if (workspace.timezone !== undefined) {
      if (typeof workspace.timezone !== "string" || !workspace.timezone.trim()) {
        res.status(400).json({ message: "Timezone is required" });
        return;
      }

      workspaceUpdates.timezone = workspace.timezone.trim();
    }

    if (workspace.brandVoice !== undefined) {
      if (typeof workspace.brandVoice !== "string" || workspace.brandVoice.length > 2000) {
        res.status(400).json({ message: "Brand voice must be text up to 2000 characters" });
        return;
      }

      workspaceUpdates.brandVoice = workspace.brandVoice.trim();
    }

    if (workspace.publishing?.urlShortening !== undefined) {
      workspaceUpdates["publishing.urlShortening"] = Boolean(workspace.publishing.urlShortening);
    }

    if (workspace.publishing?.approvalWorkflow !== undefined) {
      workspaceUpdates["publishing.approvalWorkflow"] = Boolean(workspace.publishing.approvalWorkflow);
    }

    if (workspace.notifications?.postFailAlerts !== undefined) {
      workspaceUpdates["notifications.postFailAlerts"] = Boolean(workspace.notifications.postFailAlerts);
    }

    if (workspace.notifications?.weeklyDigest !== undefined) {
      workspaceUpdates["notifications.weeklyDigest"] = Boolean(workspace.notifications.weeklyDigest);
    }
  }

  const settingsUpdate: Record<string, unknown> = {
    $setOnInsert: { user: req.user._id },
  };

  if (Object.keys(workspaceUpdates).length > 0) {
    settingsUpdate.$set = workspaceUpdates;
  }

  const settings = await WorkspaceSettings.findOneAndUpdate(
    { user: req.user._id },
    settingsUpdate,
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  req.user = user;
  const settingsResponse = presentSettingsResponse(user, settings);
  broadcastToUser(req.user._id.toString(), "settings:changed", {
    status: "settings-updated",
    settings: settingsResponse,
  });
  res.json(settingsResponse);
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

  const settings = await getOrCreateWorkspaceSettings(req.user._id.toString());
  broadcastToUser(req.user._id.toString(), "settings:changed", {
    status: "profile-photo-updated",
    settings: presentSettingsResponse(user, settings),
  });

  res.json({ profile: presentUser(user) });
};
