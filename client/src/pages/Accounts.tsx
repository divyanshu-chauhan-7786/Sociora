import { Plus, ShieldCheck, Signal, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";

import { AccountGrid } from "../components/accounts/AccountGrid";
import { PlatformPickerModal } from "../components/accounts/PlatformPickerModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PLATFORMS } from "../constants/platforms";
import { accountApi } from "../lib/api";
import type { PlatformId, SocialAccount } from "../types";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const Accounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");

    if (connectedPlatform) {
      setNotice(`${connectedPlatform} connected. Syncing account details...`);
      window.history.replaceState({}, "", window.location.pathname);
    }

    setSyncing(true);
    accountApi.sync()
      .then((syncedAccounts) => {
        setAccounts(syncedAccounts);
        if (connectedPlatform) {
          setNotice("Account connected and synced.");
        }
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Accounts failed to sync"))
      .finally(() => setSyncing(false));
  }, []);

  const connectedIds = useMemo(
    () => accounts.map((account) => account.platform),
    [accounts],
  );

  const handleDisconnect = async (accountId: string) => {
    const confirmed = window.confirm("Disconnect this account from Sociora?");

    if (!confirmed) {
      return;
    }

    await accountApi.disconnect(accountId);
    setAccounts((currentAccounts) =>
      currentAccounts.filter((account) => account.id !== accountId),
    );
  };

  const handleConnect = async (platformId: PlatformId) => {
    setConnecting(platformId);
    setError("");

    try {
      // Fetch Zernio OAuth URL and log it for debugging
      const { url } = await accountApi.getAuthUrl(platformId);
      console.log(`Redirecting to Zernio Auth URL for ${platformId}:`, url);
      window.location.href = url;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Connection request failed. Please check backend server.");
    } finally {
      setConnecting(null);
    }
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
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}
      {notice && !error && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">{notice}</p>
      )}
      {syncing && (
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500">
          Syncing connected accounts from Zernio...
        </p>
      )}

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
