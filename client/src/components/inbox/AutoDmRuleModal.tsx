import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import type { CommentAutomationRule } from "../../lib/api";

interface AutoDmRuleModalProps {
  onClose: () => void;
  onSave: (rule: Omit<CommentAutomationRule, "_id" | "id" | "createdAt" | "triggerCount">) => Promise<void>;
}

export const AutoDmRuleModal = ({ onClose, onSave }: AutoDmRuleModalProps) => {
  useBodyScrollLock(true);

  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<"all" | "instagram" | "facebook">("all");
  const [keyword, setKeyword] = useState("");
  const [replyText, setReplyText] = useState("");
  const [dmText, setDmText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !keyword.trim() || !replyText.trim() || !dmText.trim()) {
      setError("Please fill all required fields: Rule name, Keyword, Reply text, and DM payload.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        name: name.trim(),
        platform,
        keyword: keyword.trim().toLowerCase(),
        replyText: replyText.trim(),
        dmText: dmText.trim(),
        isActive: true,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create Auto-DM rule.");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative z-10 w-full max-w-[560px] max-h-[85vh] flex flex-col overflow-hidden rounded-[2.2rem] border border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <span>Create Auto-DM Rule</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-orange-600 dark:text-orange-400">
                    <Sparkles className="h-3 w-3" />
                    AI Automation
                  </span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Auto-reply to comments & send private DMs when users comment keywords
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                {error}
              </p>
            )}

            {/* Rule Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Automation Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Free Guide Auto-DM Campaign"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Channels
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "All Channels" },
                  { id: "instagram", label: "Instagram" },
                  { id: "facebook", label: "Facebook" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlatform(item.id as any)}
                    className={`rounded-xl py-2 px-3 text-xs font-black border transition-all ${
                      platform === item.id
                        ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Keyword */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Trigger Keyword (Case-Insensitive)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. LINK or PRICE or GUIDE"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">
                  Matches "link", "Link", "LINK"
                </span>
              </div>
            </div>

            {/* Public Reply Comment */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Public Comment Reply</span>
                <span className="text-[10px] text-slate-400 font-semibold">Visible on Post</span>
              </label>
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="e.g. Check your DM! Sent you the exclusive access link 📩"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Private DM Payload */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Private DM Message</span>
                <span className="text-[10px] text-slate-400 font-semibold">Sent to Inbox</span>
              </label>
              <textarea
                rows={3}
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                placeholder="e.g. Hey! Thanks for your comment. Here is your direct link: https://sociora.ai/free-guide"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-5 py-2 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/35 disabled:opacity-50"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>{saving ? "Saving Rule..." : "Create Auto-DM Rule"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
