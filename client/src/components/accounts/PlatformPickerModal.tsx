import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Lock, PlugZap, ShieldCheck, X } from "lucide-react";
import { createPortal } from "react-dom";
import { PLATFORMS, isPlatformActive } from "../../constants/platforms";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import type { PlatformId } from "../../types";
import { Badge } from "../ui/Badge";

interface PlatformPickerModalProps {
  connectedIds: PlatformId[];
  connecting: PlatformId | null;
  onClose: () => void;
  onConnect: (platformId: PlatformId) => void;
}

export const PlatformPickerModal = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) => {
  // Lock body scrolling so no browser window scrollbar appears
  useBodyScrollLock(true);

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window Container - Centered within Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative z-10 w-full max-w-[540px] max-h-[85vh] flex flex-col overflow-hidden rounded-[2.2rem] border border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-7"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <PlugZap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Connect Social Channel</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a platform to authorize via Zernio OAuth
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

          {/* Platform List - Compact & Viewport Fitted */}
          <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-1">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const isConnected = connectedIds.includes(platform.id);
              const isConnecting = connecting === platform.id;
              const isLocked = !isPlatformActive(platform.id);

              return (
                <motion.button
                  key={platform.id}
                  whileHover={{ scale: isLocked ? 1 : 1.01 }}
                  whileTap={{ scale: isLocked ? 1 : 0.99 }}
                  disabled={isConnecting || isLocked}
                  onClick={() => !isLocked && onConnect(platform.id)}
                  type="button"
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                    isConnected
                      ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                      : isLocked
                      ? "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 opacity-60 cursor-not-allowed"
                      : "border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] hover:border-orange-500/40 hover:bg-orange-500/5 dark:hover:bg-orange-500/10 shadow-sm"
                  }`}
                >
                  {/* Icon Badge */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105 ${platform.bgClass} ${platform.colorClass}`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-950 dark:text-white">
                        {platform.name}
                      </span>
                      <Badge tone={isConnected ? "success" : isLocked ? "warning" : "brand"}>
                        {isConnected ? "Connected" : isLocked ? "Upcoming" : "Free Active"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                      {isLocked ? platform.lockedDescription : platform.description}
                    </p>
                  </div>

                  {/* Action Icon */}
                  <div className="flex items-center">
                    {isConnecting ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
                    ) : isConnected ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isLocked ? (
                      <Lock className="h-4.5 w-4.5 text-amber-500" />
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <span>Connect</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer Note - Compact & Shrink Proof */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>OAuth 2.0 Encrypted Auth</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
