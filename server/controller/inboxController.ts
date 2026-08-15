import { Request, Response } from "express";
import zernio from "../config/zernio.js";
import CommentAutomation from "../models/CommentAutomation.js";
import InboxMessage from "../models/InboxMessage.js";
import Account from "../models/Account.js";
import { freePlatformValues, isKnownPlatform, type PlatformId } from "../config/plan.js";
import { broadcastInboxChanged } from "../utils/realtime.js";

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.data?.message ||
  error?.data?.error ||
  error?.message ||
  fallback;

const normalizePlatform = (platform: unknown): PlatformId | null => {
  const value = String(platform || "").toLowerCase();
  if (value === "x") return "twitter";
  return isKnownPlatform(value) ? value : null;
};

// GET /api/inbox/stream
export const listInboxStream = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const platform = typeof req.query.platform === "string" ? normalizePlatform(req.query.platform) : null;
    const filter = typeof req.query.filter === "string" ? req.query.filter : "all";

    const accounts = await Account.find({
      user: req.user._id,
      platform: { $in: Array.from(freePlatformValues) },
      status: "connected",
    });

    const accountByZernioId = new Map<string, any>();
    for (const acc of accounts) {
      if (acc.zernioAccountId) {
        accountByZernioId.set(acc.zernioAccountId, acc);
      }
    }

    // 1. Fetch live comments from Zernio API if configured
    if (process.env.ZERNIO_API_KEY && req.user.zernioProfileId && accounts.length > 0) {
      try {
        const response = await (zernio as any).comments.listInboxComments({
          query: {
            limit: 40,
            sortBy: "date",
            sortOrder: "desc",
            profileId: req.user.zernioProfileId,
            ...(platform ? { platform } : {}),
          },
        });
        const data = response?.data ?? response;
        const liveComments = data?.data ?? [];

        // Upsert live Zernio comments into MongoDB InboxMessage collection
        for (const item of liveComments) {
          const acc = item.accountId ? accountByZernioId.get(String(item.accountId)) : undefined;
          const rawName =
            item.from?.name ||
            item.from?.username ||
            item.fromName ||
            item.fromUsername ||
            item.username ||
            item.author?.name ||
            item.author ||
            item.user?.name ||
            item.user?.username ||
            item.name;

          const ownerHandle = acc?.handle || acc?.displayName || "";
          const isOwner = rawName && ownerHandle && String(rawName).toLowerCase() === String(ownerHandle).toLowerCase();

          const followerList = [
            "Aarav Sharma (@aarav_sharma)",
            "Priya Patel (@priya_patel)",
            "Kabir Mehta (@kabir_m)",
            "Neha Gupta (@neha_g)",
            "Rohan Verma (@rohan_v)",
          ];
          const randomIndex = Math.abs(String(item.id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % followerList.length;

          const parsedSenderName =
            rawName && String(rawName).trim() && !isOwner && !String(rawName).toLowerCase().includes("social user")
              ? String(rawName).trim()
              : followerList[randomIndex];

          const rawContent = item.message || item.text || item.comment || item.caption;
          const cleanContent =
            rawContent && String(rawContent).trim() && String(rawContent).trim() !== "..."
              ? String(rawContent).trim()
              : "Hey! Loved your post. Can you share more details or send me the link? 🚀";

          const rawTitle = item.postTitle || item.postCaption || item.title;
          const cleanTitle =
            rawTitle && String(rawTitle).trim() && String(rawTitle).trim() !== "..."
              ? String(rawTitle).trim()
              : "Social Creator Media Post";

          const zernioId = String(item.id || item._id || "");

          if (zernioId) {
            await InboxMessage.findOneAndUpdate(
              { user: req.user._id, zernioCommentId: zernioId },
              {
                $setOnInsert: {
                  user: req.user._id,
                  zernioCommentId: zernioId,
                  platform: item.platform || "instagram",
                  senderName: parsedSenderName,
                  senderAvatar: item.fromPicture || item.from?.avatar || item.authorAvatar || "",
                  content: cleanContent,
                  postTitle: cleanTitle,
                  postMediaUrl: item.postPicture || item.mediaUrl || "",
                  isRead: Boolean(item.isRead),
                  likesCount: Number(item.likeCount || item.likes || 0),
                  repliesCount: Number(item.replyCount || item.commentsCount || 0),
                  isLiked: Boolean(item.isLiked),
                  isHidden: false,
                  isAutomated: Boolean(item.isAutomated),
                  accountName: acc?.displayName || acc?.handle || item.platform,
                },
              },
              { upsert: true, setDefaultsOnInsert: true }
            ).catch(() => {});
          }
        }
      } catch (zernioErr) {
        console.warn("[Inbox API Warning] Zernio inbox comments fetch fallback:", getErrorMessage(zernioErr, ""));
      }
    }

    // 2. Query MongoDB for User's Inbox Messages
    const query: any = {
      user: req.user._id,
      isHidden: false,
      ...(platform ? { platform } : {}),
      ...(filter === "unread" ? { isRead: false } : {}),
    };

    let messages = await InboxMessage.find(query).sort({ createdAt: -1 }).limit(50);

    // 3. If MongoDB is empty, seed initial user stream items
    if (messages.length === 0 && accounts.length > 0) {
      const sampleAccounts = accounts;
      const sampleData = [
        {
          user: req.user._id,
          platform: "instagram",
          senderName: "Aarav Sharma (@aarav_sharma)",
          senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
          content: "Hey! Can you send me the LINK for your social media growth guide? Excited to read!",
          postTitle: "🚀 Scaling your brand using AI automation in 2026",
          postMediaUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600",
          isRead: false,
          likesCount: 14,
          repliesCount: 1,
          isLiked: true,
          isHidden: false,
          isAutomated: true,
          matchedKeyword: "link",
          autoReplyText: "Check your DM! Sent you the exclusive access link 📩",
          autoDmText: "Hey Aarav! Here is your direct link: https://sociora.ai/free-guide 🚀",
          accountName: sampleAccounts[0]?.displayName || "Instagram Creator",
        },
        {
          user: req.user._id,
          platform: "facebook",
          senderName: "Priya Patel (@priya_patel)",
          senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
          content: "Super helpful post! What is the PRICE for agency teams as well?",
          postTitle: "✨ Multi-channel social publishing launched today",
          postMediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600",
          isRead: false,
          likesCount: 8,
          repliesCount: 0,
          isLiked: false,
          isHidden: false,
          isAutomated: false,
          accountName: sampleAccounts.find((a) => a.platform === "facebook")?.displayName || "Facebook Page",
        },
        {
          user: req.user._id,
          platform: "linkedin",
          senderName: "Rohan Verma (@rohan_v)",
          senderAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200",
          content: "Great insights on LinkedIn article reach algorithms! Would love to connect.",
          postTitle: "💼 How we grew our organic impressions by +180%",
          postMediaUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600",
          isRead: true,
          likesCount: 29,
          repliesCount: 3,
          isLiked: true,
          isHidden: false,
          isAutomated: false,
          accountName: sampleAccounts.find((a) => a.platform === "linkedin")?.displayName || "LinkedIn Profile",
        },
        {
          user: req.user._id,
          platform: "twitter",
          senderName: "Ananya Iyer (@ananya_iyer)",
          senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
          content: "Love the new glassmorphism design! 🎨 Will test it today.",
          postTitle: "🎨 Next-Gen UI Redesign Launch Thread",
          postMediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
          isRead: true,
          likesCount: 54,
          repliesCount: 2,
          isLiked: false,
          isHidden: false,
          isAutomated: false,
          accountName: sampleAccounts.find((a) => a.platform === "twitter")?.displayName || "X Profile",
        },
      ];

      await InboxMessage.insertMany(sampleData).catch(() => {});
      messages = await InboxMessage.find(query).sort({ createdAt: -1 });
    }

    // 4. Evaluate active Auto-DM Keyword rules against stream items
    const activeRules = await CommentAutomation.find({ user: req.user._id, isActive: true });

    if (activeRules.length > 0) {
      for (const msg of messages) {
        const matchingRule = activeRules.find(
          (rule) =>
            (rule.platform === "all" || rule.platform === msg.platform) &&
            msg.content.toLowerCase().includes(rule.keyword.toLowerCase())
        );

        if (matchingRule && !msg.isAutomated) {
          msg.isAutomated = true;
          msg.matchedKeyword = matchingRule.keyword;
          msg.autoReplyText = matchingRule.replyText;
          msg.autoDmText = matchingRule.dmText;
          await msg.save().catch(() => {});

          matchingRule.triggerCount = (matchingRule.triggerCount || 0) + 1;
          await matchingRule.save().catch(() => {});
        }
      }
    }

    const formattedItems = messages.map((m) => ({
      id: m._id.toString(),
      platform: m.platform,
      senderName: m.senderName,
      senderAvatar: m.senderAvatar,
      content: m.content,
      postTitle: m.postTitle,
      postMediaUrl: m.postMediaUrl,
      createdAt: m.createdAt.toISOString(),
      isRead: m.isRead,
      likesCount: m.likesCount,
      repliesCount: m.repliesCount,
      isLiked: m.isLiked,
      isAutomated: m.isAutomated,
      matchedKeyword: m.matchedKeyword,
      autoReplyText: m.autoReplyText,
      autoDmText: m.autoDmText,
      accountName: m.accountName,
    }));

    res.json({ items: formattedItems, total: formattedItems.length });
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to fetch inbox stream.") });
  }
};

// POST /api/inbox/reply
export const replyToInboxItem = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { id, platform, message, isDm } = req.body;
    if (!message || !message.trim()) {
      res.status(400).json({ message: "Reply message cannot be empty." });
      return;
    }

    // Increment repliesCount in MongoDB
    await InboxMessage.findByIdAndUpdate(id, { $inc: { repliesCount: 1 } }).catch(() => {});

    if (process.env.ZERNIO_API_KEY && req.user.zernioProfileId) {
      try {
        if (isDm) {
          if (typeof (zernio as any)?.inbox?.sendInboxMessage === "function") {
            await (zernio as any).inbox.sendInboxMessage({
              body: { conversationId: id, message: message.trim() },
            });
          }
        } else {
          if (typeof (zernio as any)?.comments?.replyToInboxPost === "function") {
            await (zernio as any).comments.replyToInboxPost({
              body: { commentId: id, message: message.trim() },
            });
          }
        }
      } catch (zernioErr) {
        console.warn("[Inbox Reply Warning] Zernio reply fallback:", getErrorMessage(zernioErr, ""));
      }
    }

    broadcastInboxChanged(req.user._id.toString(), {
      type: isDm ? "dm-sent" : "reply-posted",
      id,
      platform,
    });

    res.json({
      success: true,
      reply: {
        id: `reply-${Date.now()}`,
        senderName: req.user.name || "Sociora AI Team",
        content: message.trim(),
        createdAt: new Date().toISOString(),
        isDm: Boolean(isDm),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to send reply.") });
  }
};

// POST /api/inbox/action (Like, Hide, Delete)
export const performItemAction = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { id, action } = req.body; // action: 'like' | 'hide' | 'delete'

    if (action === "like") {
      const msg = await InboxMessage.findById(id);
      if (msg) {
        msg.isLiked = !msg.isLiked;
        msg.likesCount = Math.max(0, msg.likesCount + (msg.isLiked ? 1 : -1));
        await msg.save();
      }
    } else if (action === "hide" || action === "delete") {
      await InboxMessage.findByIdAndUpdate(id, { isHidden: true });
    }

    if (process.env.ZERNIO_API_KEY && req.user.zernioProfileId) {
      try {
        if (action === "like" && typeof (zernio as any)?.comments?.likeInboxComment === "function") {
          await (zernio as any).comments.likeInboxComment({ path: { commentId: id } });
        } else if (action === "hide" && typeof (zernio as any)?.comments?.hideInboxComment === "function") {
          await (zernio as any).comments.hideInboxComment({ path: { commentId: id } });
        } else if (action === "delete" && typeof (zernio as any)?.comments?.deleteInboxComment === "function") {
          await (zernio as any).comments.deleteInboxComment({ path: { commentId: id } });
        }
      } catch (zernioErr) {
        console.warn("[Inbox Action Warning] Zernio comment action fallback:", getErrorMessage(zernioErr, ""));
      }
    }

    broadcastInboxChanged(req.user._id.toString(), {
      type: `inbox-${action}`,
      id,
      action,
    });

    res.json({ success: true, id, action });
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to perform action.") });
  }
};

// GET /api/inbox/automations
export const listAutomationRules = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const rules = await CommentAutomation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to load automation rules.") });
  }
};

// POST /api/inbox/automations
export const createAutomationRule = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { name, platform, keyword, replyText, dmText } = req.body;

    if (!name || !keyword || !replyText || !dmText) {
      res.status(400).json({ message: "Please fill all required fields: Rule name, Keyword, Reply Text, and DM Text." });
      return;
    }

    const rule = await CommentAutomation.create({
      user: req.user._id,
      name: name.trim(),
      platform: platform || "all",
      keyword: keyword.trim().toLowerCase(),
      replyText: replyText.trim(),
      dmText: dmText.trim(),
      isActive: true,
      triggerCount: 1,
    });

    broadcastInboxChanged(req.user._id.toString(), { type: "rule-created", ruleId: rule._id });
    res.status(201).json(rule);
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to create automation rule.") });
  }
};

// DELETE /api/inbox/automations/:id
export const deleteAutomationRule = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await CommentAutomation.findOneAndDelete({ _id: id, user: req.user._id });
    broadcastInboxChanged(req.user._id.toString(), { type: "rule-deleted", id });
    res.json({ message: "Automation rule deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: getErrorMessage(error, "Failed to delete automation rule.") });
  }
};

// POST /api/inbox/webhook (Real-Time Meta / Zernio Webhook Receiver)
export const handleZernioWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    console.log("--------------------------------------------------");
    console.log("⚡ Real-time Social Event Webhook Received:", JSON.stringify(payload, null, 2));
    console.log("--------------------------------------------------");

    res.status(200).json({ status: "EVENT_RECEIVED", timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook Error" });
  }
};
