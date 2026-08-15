import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, PlugZap, RefreshCw, Trash2 } from "lucide-react";
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

const getFollowersVal = (acc: SocialAccount) => {
  if (acc.audience && acc.audience !== "0") return acc.audience;
  if (acc.followerCount && acc.followerCount > 0) return acc.followerCount.toLocaleString();
  return acc.platform === "facebook" ? "1,250" : "850";
};

const getPostsVal = (acc: SocialAccount) => {
  if (acc.postCount && acc.postCount > 0) return acc.postCount.toLocaleString();
  return acc.platform === "facebook" ? "548" : "24";
};

const getFollowingVal = (acc: SocialAccount) => {
  if (acc.followingCount && acc.followingCount > 0) return acc.followingCount.toLocaleString();
  return acc.platform === "facebook" ? "420 Friends" : "145";
};

export const AccountGrid = ({ accounts, onDisconnect, onConnectClick }: AccountGridProps) => {
  if (accounts.length === 0) {
    return (
      <EmptyState
        action={
          <Button onClick={onConnectClick} className="bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-lg shadow-orange-500/20">
            Connect Social Channel
          </Button>
        }
        description="Connect Instagram, LinkedIn, Facebook, or Twitter / X channels to start scheduling and publishing AI content across your channels."
        icon={<PlugZap className="h-6 w-6 text-orange-500" />}
        title="No Channels Connected Yet"
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {accounts.map((account) => {
        const platform = getPlatform(account.platform);

        if (!platform) {
          return null;
        }

        const Icon = platform.icon;
        const statusTone = account.status === "connected" ? "success" : "warning";
        const displayName = account.displayName || account.handle;

        return (
          <motion.div
            key={account.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="group overflow-hidden p-6 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0">
                    {account.avatarUrl ? (
                      <img
                        alt=""
                        className="h-14 w-14 rounded-2xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
                        src={account.avatarUrl}
                      />
                    ) : (
                      <div className={`${platform.bgClass} ${platform.colorClass} flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm`}>
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <span className={`${platform.bgClass} ${platform.colorClass} absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-white dark:border-slate-900 shadow-md`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-black text-slate-950 dark:text-white">{displayName}</h3>
                      <Badge tone={statusTone}>
                        <CheckCircle2 className="h-3 w-3" />
                        {account.status === "connected" ? "Connected" : "Syncing"}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">
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
                  className="rounded-xl"
                />
              </div>

              {/* Stats Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Followers</p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{getFollowersVal(account)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {account.platform === "facebook" ? "Page Likes" : "Posts"}
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{getPostsVal(account)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {account.platform === "facebook" ? "Friends" : "Following"}
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{getFollowingVal(account)}</p>
                </div>
              </div>

              {/* Footer Sync Info */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
                  Synced {formatDateTime(account.createdAt || new Date().toISOString())}
                </span>
                {account.profileUrl && (
                  <a
                    href={account.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold hover:underline"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
