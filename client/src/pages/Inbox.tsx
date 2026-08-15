import { motion } from "framer-motion";
import {
  Bot,
  EyeOff,
  Heart,
  MessageCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AutoDmRuleModal } from "../components/inbox/AutoDmRuleModal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PlatformBadge } from "../components/ui/PlatformBadge";
import {
  type CommentAutomationRule,
  type InboxStreamItem,
  inboxApi,
  realtimeApi,
} from "../lib/api";
import type { PlatformId } from "../types";

export const Inbox = () => {
  const [streamItems, setStreamItems] = useState<InboxStreamItem[]>([]);
  const [rules, setRules] = useState<CommentAutomationRule[]>([]);
  const [selectedItem, setSelectedItem] = useState<InboxStreamItem | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformId | "all">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "rules">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isDmReply, setIsDmReply] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [streamError, setStreamError] = useState("");

  const loadStream = useCallback(async () => {
    setLoading(true);
    setStreamError("");
    try {
      const { items } = await inboxApi.stream(
        activePlatform,
        activeFilter === "unread" ? "unread" : "all"
      );
      setStreamItems(items);
      if (items.length > 0 && !selectedItem) {
        setSelectedItem(items[0]);
      }
    } catch (err: any) {
      setStreamError(err?.message || "Failed to load inbox stream.");
    } finally {
      setLoading(false);
    }
  }, [activePlatform, activeFilter, selectedItem]);

  const loadRules = useCallback(async () => {
    try {
      const rulesData = await inboxApi.getRules();
      setRules(rulesData);
    } catch (err) {
      console.warn("Failed to load automation rules:", err);
    }
  }, []);

  useEffect(() => {
    void loadStream();
    void loadRules();
  }, [activePlatform, activeFilter]);

  // Real-time EventSource SSE Listener for live stream updates
  useEffect(() => {
    const url = realtimeApi.getUrl();
    if (!url) return;

    const events = new EventSource(url);
    const refresh = () => {
      void loadStream();
      void loadRules();
    };

    events.addEventListener("inbox:changed", refresh);
    events.onerror = () => {
      events.close();
    };

    return () => {
      events.close();
    };
  }, [loadStream, loadRules]);

  const handleSendReply = async () => {
    if (!selectedItem || !replyMessage.trim()) return;
    setSendingReply(true);

    try {
      await inboxApi.reply({
        id: selectedItem.id,
        platform: selectedItem.platform,
        message: replyMessage.trim(),
        isDm: isDmReply,
      });

      // Update local item
      setStreamItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, repliesCount: item.repliesCount + 1 }
            : item
        )
      );

      setReplyMessage("");
      alert(isDmReply ? "Private DM sent successfully! 📩" : "Public comment reply posted! 💬");
    } catch (err: any) {
      alert(err?.message || "Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleGenerateAiReply = () => {
    if (!selectedItem) return;
    setAiGenerating(true);
    setTimeout(() => {
      const contentLower = selectedItem.content.toLowerCase();
      let smartReply = "";

      if (contentLower.includes("link") || contentLower.includes("where") || contentLower.includes("guide")) {
        smartReply = isDmReply
          ? `Hey ${selectedItem.senderName}! Here is the direct link you requested: https://sociora.ai/resources 🚀 Enjoy!`
          : `Thanks for your comment, ${selectedItem.senderName}! Check your DM for the direct access link 📩✨`;
      } else if (contentLower.includes("price") || contentLower.includes("cost") || contentLower.includes("plan")) {
        smartReply = isDmReply
          ? `Hi ${selectedItem.senderName}! Sociora 2.0 is 100% FREE right now during launch. Check it out at https://sociora.ai`
          : `Great question, ${selectedItem.senderName}! We've sent you a private DM with all pricing & plan details 💬`;
      } else if (selectedItem.platform === "linkedin") {
        smartReply = `Thank you for sharing your thoughts on this topic, ${selectedItem.senderName}! Great insights regarding "${selectedItem.postTitle || 'our strategy'}". Let's connect further! 💼`;
      } else if (selectedItem.platform === "twitter") {
        smartReply = `Appreciate the mention, @${selectedItem.senderName.replace(/\s+/g, '')}! Glad you found our post on "${selectedItem.postTitle}" valuable. 🚀🔥`;
      } else {
        smartReply = `Thanks for connecting, ${selectedItem.senderName}! We're thrilled to have you here. Let us know if you have any questions! ✨`;
      }

      setReplyMessage(smartReply);
      setAiGenerating(false);
    }, 400);
  };

  const handleAction = async (action: "like" | "hide" | "delete") => {
    if (!selectedItem) return;
    try {
      await inboxApi.action({ id: selectedItem.id, action });
      if (action === "like") {
        setStreamItems((prev) =>
          prev.map((i) =>
            i.id === selectedItem.id ? { ...i, isLiked: !i.isLiked, likesCount: i.likesCount + (i.isLiked ? -1 : 1) } : i
          )
        );
        setSelectedItem((prev) => prev ? { ...prev, isLiked: !prev.isLiked, likesCount: prev.likesCount + (prev.isLiked ? -1 : 1) } : null);
      } else if (action === "delete" || action === "hide") {
        setStreamItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
        setSelectedItem(null);
      }
    } catch (err: any) {
      alert(err?.message || `Failed to ${action} item.`);
    }
  };

  const handleSaveRule = async (ruleData: Omit<CommentAutomationRule, "_id" | "id" | "createdAt" | "triggerCount">) => {
    const newRule = await inboxApi.createRule(ruleData);
    setRules((prev) => [newRule, ...prev]);
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm("Delete this Auto-DM automation rule?")) return;
    await inboxApi.deleteRule(id);
    setRules((prev) => prev.filter((r) => r._id !== id && r.id !== id));
  };

  const filteredItems = streamItems.filter(
    (item) =>
      item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.postTitle && item.postTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-7 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase text-orange-600 dark:text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              Unified Inbox & Auto-DM Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Social Inbox & Comment Automation
          </h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Read, reply, and trigger automatic DMs for comments across Instagram, Facebook, LinkedIn & X.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowRuleModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/35"
          >
            <Plus className="h-4 w-4" />
            <span>Create Auto-DM Rule</span>
          </button>
        </div>
      </div>

      {/* Main Mode Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Stream", icon: MessageSquare },
            { id: "unread", label: "Unread Messages", icon: MessageCircle },
            { id: "rules", label: `Auto-DM Rules (${rules.length})`, icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
                  activeFilter === tab.id
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500/10 hover:text-orange-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Selector Pills */}
        {activeFilter !== "rules" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Channels" },
              { id: "instagram", label: "Instagram" },
              { id: "facebook", label: "Facebook" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "twitter", label: "X / Twitter" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatform(p.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                  activePlatform === p.id
                    ? "bg-orange-500 text-white font-black shadow-sm"
                    : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode 1: Auto-DM Rules View */}
      {activeFilter === "rules" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Active Keyword Auto-DM Rules</h3>
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowRuleModal(true)}>
              New Automation Rule
            </Button>
          </div>

          {rules.length === 0 ? (
            <Card className="p-8 text-center rounded-[2rem]">
              <Bot className="mx-auto h-10 w-10 text-orange-500 mb-3" />
              <h4 className="text-base font-black text-slate-950 dark:text-white">No Auto-DM Rules Created Yet</h4>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Create keyword rules so when users comment on your Instagram or Facebook posts, Sociora automatically sends a public comment reply and a private DM.
              </p>
              <Button className="mt-4" onClick={() => setShowRuleModal(true)}>
                Create First Auto-DM Rule
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rules.map((rule) => (
                <Card key={rule._id || rule.id} className="p-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-950 dark:text-white">{rule.name}</h4>
                        <Badge tone={rule.isActive ? "success" : "neutral"}>
                          {rule.isActive ? "Active Trigger" : "Paused"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Target: <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{rule.platform}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => rule._id && handleDeleteRule(rule._id)}
                      className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-slate-100 dark:border-white/5 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Keyword Trigger:</span>
                      <span className="ml-2 font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md uppercase">
                        "{rule.keyword}"
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Public Reply:</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5 italic">"{rule.replyText}"</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Private DM Message:</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5 italic">"{rule.dmText}"</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Triggers fired: {rule.triggerCount || 0} times</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Auto-DM Ready
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: 2-Column Split Stream & Action Panel */
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Column 1: Stream List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comments, DMs, senders..."
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none backdrop-blur-xl shadow-sm"
              />
            </div>

            {/* Stream Cards Container */}
            <div className="max-h-[650px] overflow-y-auto space-y-3 pr-1">
              {streamError && <p className="p-3 text-xs font-bold text-red-500 rounded-xl bg-red-50 dark:bg-red-950/30">{streamError}</p>}
              {loading ? (
                <p className="p-4 text-xs font-bold text-slate-400">Loading inbox stream...</p>
              ) : filteredItems.length === 0 ? (
                <p className="p-6 text-xs font-bold text-slate-400 text-center">No messages or comments found.</p>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedItem(item)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-500/5 dark:bg-orange-500/10 shadow-md"
                          : "border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 hover:border-orange-400/40 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.senderAvatar ? (
                            <img
                              src={item.senderAvatar}
                              alt=""
                              className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 font-black text-sm">
                              {item.senderName[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-xs font-black text-slate-950 dark:text-white">
                                {item.senderName}
                              </span>
                              <PlatformBadge compact platformId={item.platform} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">
                              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {item.isAutomated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-orange-600 dark:text-orange-400">
                            <Zap className="h-3 w-3" /> Auto
                          </span>
                        )}
                      </div>

                      <p className="mt-2.5 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                        {item.content}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span className="truncate max-w-[200px]">{item.postTitle || "Social Post"}</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{item.likesCount}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-teal-500" />{item.repliesCount}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Right Detail & Action Panel (7 cols) */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <Card className="p-6 rounded-[2.2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur-xl space-y-5">
                {/* Header Profile Info */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    {selectedItem.senderAvatar ? (
                      <img
                        src={selectedItem.senderAvatar}
                        alt=""
                        className="h-12 w-12 rounded-2xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 font-black text-lg">
                        {selectedItem.senderName[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-950 dark:text-white">
                          {selectedItem.senderName}
                        </h3>
                        <PlatformBadge compact platformId={selectedItem.platform} />
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Account: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedItem.accountName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAction("like")}
                      className={`rounded-xl p-2.5 transition-colors border ${
                        selectedItem.isLiked
                          ? "bg-red-500/10 text-red-500 border-red-500/30"
                          : "border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Like Comment"
                    >
                      <Heart className={`h-4 w-4 ${selectedItem.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction("hide")}
                      className="rounded-xl p-2.5 border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors"
                      title="Hide Comment"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction("delete")}
                      className="rounded-xl p-2.5 border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content Message Box */}
                <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-4 border border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>{selectedItem.postTitle || "Post Activity"}</span>
                    <span>{new Date(selectedItem.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-sm font-semibold leading-relaxed text-slate-900 dark:text-white">
                    "{selectedItem.content}"
                  </p>

                  {/* Auto-DM Trigger Fired Banner */}
                  {selectedItem.isAutomated && (
                    <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3.5 space-y-1.5 text-xs font-semibold">
                      <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 font-black">
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-4 w-4 fill-orange-500" />
                          <span>Auto-DM Keyword Fired: "{selectedItem.matchedKeyword || 'link'}"</span>
                        </span>
                        <span className="text-[10px] uppercase bg-orange-500 text-white px-2 py-0.5 rounded-md">Executed</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        💬 <span className="font-bold">Public Comment Reply:</span> "{selectedItem.autoReplyText || 'Check your DM! Sent you the exclusive access link 📩'}"
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        📩 <span className="font-bold">Private Inbox DM:</span> "{selectedItem.autoDmText || 'Hey! Here is your direct link: https://sociora.ai/free-guide'}"
                      </p>
                    </div>
                  )}

                  {selectedItem.postMediaUrl && (
                    <img
                      src={selectedItem.postMediaUrl}
                      alt=""
                      className="h-40 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                  )}
                </div>

                {/* Reply Composer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Write Response
                    </label>

                    {/* AI Generator Button */}
                    <button
                      type="button"
                      disabled={aiGenerating}
                      onClick={handleGenerateAiReply}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all shadow-xs"
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${aiGenerating ? "animate-spin" : ""}`} />
                      <span>{aiGenerating ? "Generating AI Reply..." : "✨ AI Quick Reply"}</span>
                    </button>
                  </div>

                  {/* Mode Toggle: Comment vs Private DM */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDmReply(false)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-black border transition-all ${
                        !isDmReply
                          ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "border-slate-200 dark:border-white/10 text-slate-500"
                      }`}
                    >
                      Public Comment Reply 💬
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDmReply(true)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-black border transition-all ${
                        isDmReply
                          ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "border-slate-200 dark:border-white/10 text-slate-500"
                      }`}
                    >
                      Private Inbox DM 📩
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder={isDmReply ? "Write private DM payload..." : "Write public comment response..."}
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3.5 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      {isDmReply ? "Direct Message via Zernio API" : "Public Reply via Zernio API"}
                    </span>
                    <button
                      type="button"
                      disabled={sendingReply || !replyMessage.trim()}
                      onClick={handleSendReply}
                      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/35 disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{sendingReply ? "Sending..." : isDmReply ? "Send Private DM" : "Post Reply"}</span>
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center rounded-[2.2rem]">
                <MessageSquare className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <h4 className="text-base font-black text-slate-950 dark:text-white">Select a Comment or DM</h4>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click any item from the stream to view full post details, generate AI replies, or trigger moderation actions.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Auto-DM Rule Modal */}
      {showRuleModal && (
        <AutoDmRuleModal
          onClose={() => setShowRuleModal(false)}
          onSave={handleSaveRule}
        />
      )}
    </div>
  );
};

export default Inbox;
