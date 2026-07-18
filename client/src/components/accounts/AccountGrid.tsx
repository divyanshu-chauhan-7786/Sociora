import { CheckCircle2, ExternalLink, MoreHorizontal, PlugZap, Trash2 } from "lucide-react";

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
        description="Connect Instagram or LinkedIn to start publishing on the free launch plan. Facebook, Twitter / X, and YouTube are locked for Sociora 2.0."
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
        const displayName = account.displayName || account.handle;

        return (
          <Card key={account.id} className="group p-5 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-12 w-12 shrink-0">
                  {account.avatarUrl ? (
                    <img
                      alt=""
                      className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                      src={account.avatarUrl}
                    />
                  ) : (
                    <div className={`${platform.bgClass} ${platform.colorClass} flex h-12 w-12 items-center justify-center rounded-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <span className={`${platform.bgClass} ${platform.colorClass} absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md border border-white`}>
                    <Icon className="h-3 w-3" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-black text-slate-950">{displayName}</h3>
                    <Badge tone={statusTone}>
                      <CheckCircle2 className="h-3 w-3" />
                      {account.status === "connected" ? "Connected" : "Syncing"}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-slate-500">
                    @{account.handle} on {platform.name}
                  </p>
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

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Followers</p>
                <p className="mt-1 text-lg font-black text-slate-950">{account.audience}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Posts</p>
                <p className="mt-1 text-lg font-black text-slate-950">{account.postCount.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Following</p>
                <p className="mt-1 text-lg font-black text-slate-950">{account.followingCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-400">Last synced</p>
                <p className="mt-1 text-sm font-black text-slate-950">{formatDateTime(account.lastSyncedAt)}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-bold text-teal-700">
                {account.analytics?.hasAnalyticsAccess ? "Analytics synced" : "Ready to publish"}
              </span>
              {account.profileUrl ? (
                <a
                  aria-label={`Open ${platform.name} profile`}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-teal-700"
                  href={account.profileUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
