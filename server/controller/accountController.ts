import { Request, Response } from "express";
import Account from "../models/Account.js";
import zernio from "../config/zernio.js";
import { freePlatformValues, getPaidPlatformMessage, isFreePlatform, isKnownPlatform, type PlatformId } from "../config/plan.js";
import { presentAccount } from "../utils/presenters.js";
import { recordActivity } from "../utils/activity.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

const normalizePlatform = (platform: unknown): PlatformId | null => {
  const value = String(platform || "").toLowerCase();

  if (value === "x") return "twitter";
  return isKnownPlatform(value) ? value : null;
};

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.data?.message ||
  error?.data?.error ||
  error?.message ||
  fallback;

const presentPlatformPost = (post: any, accountByZernioId: Map<string, any>) => {
  const platform = normalizePlatform(post.platform);
  const account = post.accountId ? accountByZernioId.get(String(post.accountId)) : undefined;

  if (!platform) {
    return null;
  }

  return {
    id: String(post.id || `${post.platform}-${post.createdTime || Date.now()}`),
    platform,
    accountId: post.accountId ? String(post.accountId) : "",
    accountName: account?.displayName || post.accountUsername || account?.handle || platform,
    content: post.content || "",
    mediaUrl: post.picture || "",
    permalink: post.permalink || "",
    publishedAt: post.createdTime || "",
    commentCount: Number(post.commentCount || 0),
    likeCount: Number(post.likeCount || 0),
    isAd: Boolean(post.isAd),
  };
};

export const listAccounts = async (req: Request | any, res: Response): Promise<void> => {
  const accounts = await Account.find({
    user: req.user._id,
    platform: { $in: Array.from(freePlatformValues) },
  }).sort({ createdAt: -1 });
  res.json(accounts.map(presentAccount));
};

export const listPlatformPosts = async (req: Request | any, res: Response): Promise<void> => {
  if (!process.env.ZERNIO_API_KEY) {
    res.status(500).json({ message: "ZERNIO_API_KEY is missing. Add it to server/.env to load connected account posts." });
    return;
  }

  const accounts = await Account.find({
    user: req.user._id,
    platform: { $in: Array.from(freePlatformValues) },
    status: "connected",
    zernioAccountId: { $exists: true, $ne: "" },
  });

  if (accounts.length === 0) {
    res.json({ posts: [], meta: { accountsQueried: 0 } });
    return;
  }

  const platform = typeof req.query.platform === "string" ? normalizePlatform(req.query.platform) : null;
  if (platform && !isFreePlatform(platform)) {
    res.status(400).json({ message: getPaidPlatformMessage([platform]) });
    return;
  }

  const accountByZernioId = new Map<string, any>();
  for (const account of accounts) {
    if (account.zernioAccountId) {
      accountByZernioId.set(account.zernioAccountId, account);
    }
  }

  try {
    const response = await (zernio as any).comments.listInboxComments({
      query: {
        limit: Math.min(Number(req.query.limit || 30), 50),
        minComments: 0,
        sortBy: "date",
        sortOrder: "desc",
        ...(req.user.zernioProfileId ? { profileId: req.user.zernioProfileId } : {}),
        ...(platform ? { platform } : {}),
      },
    });

    const data = response?.data ?? response;
    const posts = (data?.data ?? [])
      .map((post: any) => presentPlatformPost(post, accountByZernioId))
      .filter(Boolean);

    res.json({
      posts,
      meta: data?.meta ?? {},
      pagination: data?.pagination ?? {},
    });
  } catch (error: any) {
    res.status(502).json({ message: getErrorMessage(error, "Connected account posts could not be loaded from Zernio.") });
  }
};

export const connectAccount = async (req: Request | any, res: Response): Promise<void> => {
  const { platform, handle } = req.body;

  const normalizedPlatform = normalizePlatform(platform);

  if (!normalizedPlatform) {
    res.status(400).json({ message: "Unsupported platform" });
    return;
  }

  if (!isFreePlatform(normalizedPlatform)) {
    res.status(400).json({ message: getPaidPlatformMessage([normalizedPlatform]) });
    return;
  }

  const account = await Account.findOneAndUpdate(
    { user: req.user._id, platform: normalizedPlatform },
    {
      $set: {
        user: req.user._id,
        platform: normalizedPlatform,
        handle: handle?.trim() || `${normalizedPlatform}_workspace`,
        displayName: handle?.trim() || `${normalizedPlatform} workspace`,
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
    description: `${normalizedPlatform} account synced successfully.`,
    platform: normalizedPlatform,
  });

  broadcastWorkspaceChanged(req.user._id.toString(), { accountId: account._id.toString(), platform: normalizedPlatform });

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
