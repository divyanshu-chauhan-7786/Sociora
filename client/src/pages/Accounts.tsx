import { Plus, ShieldCheck, Signal, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { AccountGrid } from "../components/accounts/AccountGrid";
import { PlatformPickerModal } from "../components/accounts/PlatformPickerModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PLATFORMS } from "../constants/platforms";
import { mockAccounts } from "../constants/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PlatformId, SocialAccount } from "../types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const Accounts = () => {
  const [accounts, setAccounts] = useLocalStorage<SocialAccount[]>(
    "sociora.accounts",
    mockAccounts,
  );
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);

  const connectedIds = useMemo(
    () => accounts.map((account) => account.platform),
    [accounts],
  );

  const handleDisconnect = (accountId: string) => {
    const confirmed = window.confirm("Disconnect this account from Sociora?");

    if (!confirmed) {
      return;
    }

    setAccounts((currentAccounts) =>
      currentAccounts.filter((account) => account.id !== accountId),
    );
  };

  const handleConnect = (platformId: PlatformId) => {
    setConnecting(platformId);

    window.setTimeout(() => {
      setAccounts((currentAccounts) => {
        if (currentAccounts.some((account) => account.platform === platformId)) {
          return currentAccounts;
        }

        return [
          ...currentAccounts,
          {
            id: `account-${crypto.randomUUID()}`,
            platform: platformId,
            handle: `${platformId}_workspace`,
            status: "connected",
            audience: "0",
            lastSyncedAt: new Date().toISOString(),
          },
        ];
      });
      setConnecting(null);
      setShowPlatformPicker(false);
    }, 500);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-6"
    >
      <motion.section variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Connected Accounts</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Connect social profiles, verify status, and keep publishing permissions healthy.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowPlatformPicker(true)}>
          Connect account
        </Button>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50 text-coral-700">
              <UsersRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">{accounts.length}</p>
              <p className="text-sm font-bold text-slate-500">Connected</p>
            </div>
          </div>
          </Card>
        </motion.div>
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Signal className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">{PLATFORMS.length}</p>
              <p className="text-sm font-bold text-slate-500">Supported platforms</p>
            </div>
          </div>
          </Card>
        </motion.div>
        <motion.div variants={item} className="h-full">
          <Card className="p-4 h-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-slate-950">Secure</p>
              <p className="text-sm font-bold text-slate-500">OAuth-ready model</p>
            </div>
          </div>
          </Card>
        </motion.div>
      </section>

      <motion.div variants={item}>
        <AccountGrid
          accounts={accounts}
          onConnectClick={() => setShowPlatformPicker(true)}
          onDisconnect={handleDisconnect}
        />
      </motion.div>

      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}
    </motion.div>
  );
};

export default Accounts;
