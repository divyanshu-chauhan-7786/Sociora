import { CheckCircle2, MoreHorizontal, PlugZap, Trash2 } from "lucide-react";

import { getPlatform } from "../../constants/platforms";
import type { SocialAccount } from "../../types";
import { formatDateTime } from "../../utils/date";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";

interface AccountGridProps {
  accounts: SocialAccount[];
  onDisconnect: (accountId: string) => void;
  onConnectClick: () => void;
}

export const AccountGrid = ({ accounts, onDisconnect, onConnectClick }: AccountGridProps) => {
  if (accounts.length === 0) {
    return (
      <EmptyState
        action={<Button onClick={onConnectClick}>Connect account</Button>}
        description="Connect Instagram, Facebook, LinkedIn, Twitter / X, or YouTube to start managing publishing from one place."
        icon={<PlugZap className="h-5 w-5" />}
        title="No accounts connected"
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {accounts.map((account) => {
        const platform = getPlatform(account.platform);

        if (!platform) {
          return null;
        }

        const Icon = platform.icon;
        const statusTone = account.status === "connected" ? "success" : "warning";

        return (
          <Card key={account.id} className="group p-5 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className={`${platform.bgClass} ${platform.colorClass} flex h-12 w-12 shrink-0 items-center justify-center rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-black text-slate-950">@{account.handle}</h3>
                    <Badge tone={statusTone}>
                      <CheckCircle2 className="h-3 w-3" />
                      {account.status === "connected" ? "Connected" : "Syncing"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-500">{platform.name}</p>
                </div>
              </div>
              <Button
                aria-label={`Disconnect ${platform.name}`}
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDisconnect(account.id)}
                size="icon"
                variant="danger"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Audience</p>
                <p className="mt-1 text-lg font-black text-slate-950">{account.audience}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Last synced</p>
                <p className="mt-1 text-sm font-black text-slate-950">{formatDateTime(account.lastSyncedAt)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-bold text-teal-700">Ready to publish</span>
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
