
import {
  PlusIcon,
  Trash2Icon,
  CheckCircleIcon,
} from "lucide-react";

import { PLATFORMS } from "../assets/assets";
import { getRealisticIcon } from "./ui/SocialIcons";

interface Account {
  _id: string;
  platform: string;
  handle: string;
  status: string;
}

interface AccountListProps {
  accounts: Account[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({
  accounts,
  onDisconnect,
}: AccountListProps) => {
  const handleDisconnect = async (
    accountId: string
  ) => {
    const confirmDisconnect = window.confirm(
      "Are you sure you want to disconnect this account?"
    );

    if (!confirmDisconnect) return;

    await onDisconnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <PlusIcon className="h-7 w-7 text-slate-500" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No accounts connected
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            Connect your first social media platform to start
            scheduling, publishing and automating your content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {accounts.map((account) => {
        const platform = PLATFORMS.find(
          (p) => p.id === account.platform
        );

        if (!platform) return null;

        const Icon = platform.icon;

        return (
          <div
            key={account._id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Platform Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  {getRealisticIcon(account.platform, "h-6 w-6 text-slate-700") || <Icon className="h-6 w-6 text-slate-700" />}
                </div>

                {/* Account Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      @{account.handle}
                    </h3>

                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      <CheckCircleIcon className="h-3 w-3" />
                      Connected
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {platform.name}
                  </p>
                </div>
              </div>

              {/* Disconnect */}
              <button
                onClick={() =>
                  handleDisconnect(account._id)
                }
                className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <Trash2Icon className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;
