    
import {
  X,
  CheckCircleIcon,
  ExternalLinkIcon,
  LockIcon,
} from "lucide-react";

import { PLATFORMS } from "../assets/assets";
import { isPlatformActive } from "../constants/platforms";
import type { PlatformId } from "../types";
import { getRealisticIcon } from "./ui/SocialIcons";

interface PlatformPickerModelProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

const PlatformPickerModel = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModelProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Connect Platform
            </h3>

            <p className="text-sm text-slate-500">
              Choose a social platform to connect
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platform List */}
        <div className="max-h-[450px] overflow-y-auto p-4">
          <div className="space-y-3">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;

              const isConnected =
                connectedIds.includes(platform.id);

              const isConnecting =
                connecting === platform.id;
              const isLocked = !isPlatformActive(platform.id as PlatformId);

              return (
                <button
                  key={platform.id}
                  disabled={
                    isConnected || isConnecting || isLocked
                  }
                  onClick={() =>
                    !isLocked && onConnect(platform.id)
                  }
                  className={`w-full rounded-xl border p-4 text-left transition-all disabled:cursor-not-allowed ${
                    isConnected
                      ? "border-green-200 bg-green-50"
                      : isLocked
                      ? "border-slate-200 bg-slate-50 opacity-75"
                      : "border-slate-200 hover:border-red-200 hover:bg-red-50/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isConnected
                          ? "bg-green-100"
                          : "bg-slate-100"
                      }`}
                    >
                      {getRealisticIcon(platform.id, `h-6 w-6 ${isConnected ? "text-green-600" : "text-slate-700 opacity-90"}`) || (
                        <Icon className={`h-6 w-6 ${isConnected ? "text-green-600" : "text-slate-700"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {platform.name}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {isLocked
                          ? "Upcoming in Sociora 2.0 paid plans"
                          : platform.description}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      {isConnected ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : isConnecting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                      ) : isLocked ? (
                        <LockIcon className="h-4 w-4 text-amber-600" />
                      ) : (
                        <ExternalLinkIcon className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-500">
            Your accounts are connected securely using OAuth authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModel;
