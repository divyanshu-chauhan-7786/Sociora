import { CheckCircle2, ExternalLink, PlugZap } from "lucide-react";

import { PLATFORMS } from "../../constants/platforms";
import type { PlatformId } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

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
}: PlatformPickerModalProps) => (
  <Modal
    description="Choose a social channel to authorize through Zernio OAuth."
    onClose={onClose}
    title="Connect platform"
  >
    <div className="space-y-3">
      {PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        const isConnected = connectedIds.includes(platform.id);
        const isConnecting = connecting === platform.id;

        return (
          <button
            key={platform.id}
            className="group flex w-full items-center gap-4 rounded-lg border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isConnecting}
            onClick={() => onConnect(platform.id)}
            type="button"
          >
            <span className={`${platform.bgClass} ${platform.colorClass} flex h-12 w-12 shrink-0 items-center justify-center rounded-lg`}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-slate-950">{platform.name}</span>
              <span className="mt-1 block text-sm font-semibold text-slate-500">
                {platform.description}
              </span>
            </span>
            {isConnecting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
            ) : isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
            ) : (
              <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-teal-600" />
            )}
          </button>
        );
      })}
    </div>
    <div className="mt-5 rounded-lg bg-[linear-gradient(135deg,#fff1f2,#f0fdfa)] p-4">
      <div className="flex gap-3">
        <PlugZap className="h-5 w-5 shrink-0 text-coral-600" />
        <p className="text-sm font-semibold leading-6 text-slate-600">
          You will be securely redirected to the selected platform to authorize Sociora via Zernio.
        </p>
      </div>
    </div>
    <div className="mt-5 flex justify-end">
      <Button onClick={onClose} variant="secondary">
        Done
      </Button>
    </div>
  </Modal>
);
