import { Request, Response } from "express";
import Account from "../models/Account.js";
import zernio from "../config/zernio.js";
import { presentAccount } from "../utils/presenters.js";
import { recordActivity } from "../utils/activity.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

const platformValues = ["instagram", "facebook", "linkedin", "twitter", "youtube"];
type PlatformId = "instagram" | "facebook" | "linkedin" | "twitter" | "youtube";

export const listAccounts = async (req: Request | any, res: Response): Promise<void> => {
  const accounts = await Account.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(accounts.map(presentAccount));
};

export const connectAccount = async (req: Request | any, res: Response): Promise<void> => {
  const { platform, handle } = req.body;

  if (!platformValues.includes(platform)) {
    res.status(400).json({ message: "Unsupported platform" });
    return;
  }

  const account = await Account.findOneAndUpdate(
    { user: req.user._id, platform },
    {
      $set: {
        user: req.user._id,
        platform,
        handle: handle?.trim() || `${platform}_workspace`,
        displayName: handle?.trim() || `${platform} workspace`,
        status: "connected",
        audience: req.body.audience ?? "0",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await recordActivity({
    user: req.user._id.toString(),
    type: "connected",
    title: "Account connected",
    description: `${platform} account synced successfully.`,
    platform: platform as PlatformId,
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { accountId: account._id.toString(), platform });

  res.status(201).json(presentAccount(account));
};

export const disconnectAccount = async (req: Request | any, res: Response): Promise<void> => {
  const account = await Account.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!account) {
    res.status(404).json({ message: "Account not found" });
    return;
  }

  if (account.zernioAccountId) {
    try {
      await (zernio as any).accounts.deleteAccount({
        path: { accountId: account.zernioAccountId },
      });
    } catch (error: any) {
      console.warn("[Disconnect Warning] Zernio account delete failed:", error?.response?.data || error?.message || error);
    }
  }

  broadcastWorkspaceChanged(req.user._id.toString(), { accountId: req.params.id, status: "disconnected" });

  res.status(204).send();
};
