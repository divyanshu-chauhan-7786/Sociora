import { Request, Response } from "express";
import zernio from "../config/zernio.js";
import User from "../models/User.js";
import Account from "../models/Account.js";
import { freePlatformValues, getPaidPlatformMessage, isKnownPlatform, isFreePlatform, type PlatformId } from "../config/plan.js";
import { presentAccount } from "../utils/presenters.js";
import { broadcastWorkspaceChanged } from "../utils/realtime.js";

const normalizePlatform = (platform: unknown): PlatformId | null => {
    const value = String(platform || "").toLowerCase();

    if (value === "instagram_business") return "instagram";
    if (value === "facebook_page") return "facebook";
    if (value === "linkedin_page") return "linkedin";
    if (value === "x") return "twitter";

    return isKnownPlatform(value) ? value : null;
};

// helper to ensure user has a zernio Profile
const getOrCreateZernioProfile = async (user:any):Promise<string> => {
    try {
        if (!process.env.ZERNIO_API_KEY) {
            throw new Error("ZERNIO_API_KEY is missing in backend .env file. Please add it and restart the server.");
        }

        // If the user already has a profile ID saved, return it immediately
        if (user.zernioProfileId) {
            return user.zernioProfileId;
        }

        // Create one Zernio profile per Sociora user so connected accounts never leak between users.
        const createResult = await (zernio as any).profiles.createProfile({
            body: {
                name: `${user.name || user.email}'s workspace`,
            },
        });

        const newPid = createResult.data?.profile?._id || createResult.data?.profile?.id || createResult.data?._id || createResult.data?.id;
        if (!newPid) {
            throw new Error("Zernio did not return a profile ID.");
        }

        await User.findByIdAndUpdate(user._id, { zernioProfileId: newPid });
        return newPid;
    } catch (error) {
        console.error("Error getting or creating Zernio profile:", error);
        throw error;
    }
}

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.data?.error ||
    error?.message ||
    fallback;

const getAccountId = (account: any) => account?._id || account?.id;

const getAccountHandle = (account: any) =>
    account?.username || account?.handle || account?.displayName || account?.name || "user";

const toNumber = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value.replace(/,/g, ""));
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
};

const findMetricValue = (sources: unknown[], keys: string[]): number | undefined => {
    const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));
    const seen = new Set<unknown>();

    const visit = (value: unknown): number | undefined => {
        if (!value || typeof value !== "object" || seen.has(value)) {
            return undefined;
        }

        seen.add(value);

        for (const [key, rawValue] of Object.entries(value as Record<string, unknown>)) {
            if (normalizedKeys.has(key.toLowerCase())) {
                const metricValue = toNumber(rawValue);
                if (metricValue !== undefined) {
                    return metricValue;
                }
            }
        }

        for (const rawValue of Object.values(value as Record<string, unknown>)) {
            const nestedValue = visit(rawValue);
            if (nestedValue !== undefined) {
                return nestedValue;
            }
        }

        return undefined;
    };

    for (const source of sources) {
        const metricValue = visit(source);
        if (metricValue !== undefined) {
            return metricValue;
        }
    }

    return undefined;
};

const metricSources = (account: any, stats?: any) => [
    stats?.accountStats,
    stats?.metadata,
    stats,
    account?.metadata,
    account?.public_metrics,
    account?.statistics,
    account?.stats,
    account,
];

const getPostCount = (account: any, stats?: any) =>
    findMetricValue(metricSources(account, stats), [
        "mediaCount",
        "media_count",
        "videoCount",
        "video_count",
        "tweetCount",
        "tweet_count",
        "statuses_count",
        "postsCount",
        "posts_count",
        "postCount",
        "post_count",
        "pinCount",
        "pin_count",
        "upload_count",
    ]) ?? 0;

const getFollowingCount = (account: any, stats?: any) =>
    findMetricValue(metricSources(account, stats), [
        "followingCount",
        "following_count",
        "followsCount",
        "follows_count",
        "friends_count",
    ]) ?? 0;

const getFollowerCount = (account: any, stats?: any) =>
    toNumber(stats?.currentFollowers) ??
    findMetricValue(metricSources(account, stats), [
        "followersCount",
        "followers_count",
        "followerCount",
        "follower_count",
        "fan_count",
        "subscriberCount",
        "subscriber_count",
    ]) ??
    0;

const formatMetric = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("en-US") : "0";

const getFollowerStatsByAccount = async (profileId: string, accountIds: string[]) => {
    if (accountIds.length === 0) {
        return new Map<string, any>();
    }

    try {
        const response = await (zernio as any).accounts.getFollowerStats({
            query: {
                profileId,
                accountIds: accountIds.join(","),
                granularity: "daily",
            },
        });
        const statsAccounts: any[] = response?.data?.accounts || response?.accounts || [];
        return new Map(statsAccounts.map((account) => [getAccountId(account), account]));
    } catch (error: any) {
        console.warn("[Sync Warning] Follower stats unavailable:", getErrorMessage(error, "Follower stats unavailable"));
        return new Map<string, any>();
    }
};

//  Generate OAuth authorization Url
// GET /api/auth/social/:platform
export const generateOAuthUrl = async (req: Request | any, res: Response): Promise<void> => {
    try {
        const platform = String(req.params.platform || "").toLowerCase();
        const user = req.user; // Assumes auth middleware attaches logged in 'user' to 'req'
        
        const normalizedPlatform = normalizePlatform(platform);
        if (!normalizedPlatform) {
            res.status(400).json({ message: "Unsupported platform." });
            return;
        }

        if (!isFreePlatform(normalizedPlatform)) {
            res.status(400).json({ message: getPaidPlatformMessage([normalizedPlatform]) });
            return;
        }

        if (!user) {
            res.status(401).json({ message: "Unauthorized. Please log in." });
            return;
        }

        const profileId = await getOrCreateZernioProfile(user);
        const redirectUrl = process.env.CLIENT_ORIGIN ? `${process.env.CLIENT_ORIGIN}/accounts` : "http://localhost:5173/accounts";

        const authResponse = await (zernio as any).connect.getConnectUrl({
            path: { platform: normalizedPlatform },
            query: {
                profileId,
                redirect_url: redirectUrl,
            },
        });

        const url = authResponse.data?.authUrl || authResponse.data?.url || authResponse.authUrl || authResponse.url;
        if (!url) {
            throw new Error("Zernio did not return an OAuth URL.");
        }

        res.status(200).json({ url });
    } catch (error: any) {
        console.error(`[OAuth Error] Failed to generate URL for ${req.params.platform}:`, error?.response?.data || error);
        // Return the EXACT error message from Zernio SDK to the frontend UI
        res.status(500).json({ message: getErrorMessage(error, "Failed to generate OAuth URL.") });
    }
}


// sync connected accounts from zernio into MongoDb
// GET /api/auth/sync
export const syncAccounts = async (req: Request | any, res: Response): Promise<void> => {
    try {
        const user = req.user; // Assumes auth middleware attaches logged in 'user' to 'req'
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const profileId = await getOrCreateZernioProfile(user);
        if (!profileId) {
            res.status(500).json({ message: "Could not establish a Zernio profile." });
            return;
        }

        const zernioAccountsResponse = await (zernio as any).accounts.listAccounts({
            query: { profileId },
        });
        const resData = zernioAccountsResponse?.data || zernioAccountsResponse;

        let zernioAccounts: any[] = Array.isArray(resData) ? resData : (resData?.accounts || resData?.data || []);
        if (!Array.isArray(zernioAccounts)) zernioAccounts = []; // Fallback safety check
        
        const zernioAccountIds = zernioAccounts.map(getAccountId).filter(Boolean);
        const statsByAccount = await getFollowerStatsByAccount(profileId, zernioAccountIds);

        // Delete accounts from our DB that are no longer on Zernio
        await Account.deleteMany({
            user: user._id,
            zernioAccountId: { $nin: zernioAccountIds }, // $nin => "not in"
        });

        // Upsert (update or insert) accounts from Zernio into our DB
        if (zernioAccounts.length > 0) {
            const bulkOps = zernioAccounts
                .map(acc => {
                    const platform = normalizePlatform(acc.platform);
                    if (!platform) {
                        return null;
                    }

                    if (!isFreePlatform(platform)) {
                        return null;
                    }

                    const accountId = getAccountId(acc);
                    if (!accountId) {
                        return null;
                    }

                    const stats = statsByAccount.get(accountId);
                    const followerCount = getFollowerCount(acc, stats);
                    const followingCount = getFollowingCount(acc, stats);
                    const postCount = getPostCount(acc, stats);

                    return {
                        updateOne: {
                            filter: { user: user._id, zernioAccountId: accountId },
                            update: { $set: {
                        user: user._id,
                        platform,
                                handle: getAccountHandle(acc),
                                displayName: acc.displayName || acc.name || getAccountHandle(acc),
                                avatarUrl: acc.profilePicture || acc.avatar || acc.avatar_url,
                                profileUrl: acc.profileUrl,
                                zernioAccountId: accountId,
                                status: acc.isActive === false ? 'disconnected' as const : 'connected' as const,
                                audience: formatMetric(followerCount),
                                followerCount,
                                followingCount,
                                postCount,
                                zernioMetadata: {
                                    ...acc.metadata,
                                    latestAccountStats: stats?.accountStats,
                                    hasAnalyticsAccess: Boolean(resData?.hasAnalyticsAccess),
                                    followersLastUpdated: stats?.lastUpdated || acc.followersLastUpdated,
                                    followerGrowth: stats?.growth,
                                    followerGrowthPercentage: stats?.growthPercentage,
                                },
                            }},
                            upsert: true,
                        },
                    };
                })
                .filter(Boolean);

            if (bulkOps.length > 0) {
                await Account.bulkWrite(bulkOps as any);
            }
        }

        const syncedAccounts = await Account.find({
            user: user._id,
            platform: { $in: Array.from(freePlatformValues) },
        });
        broadcastWorkspaceChanged(user._id.toString(), { status: "accounts-synced" });
        res.status(200).json(syncedAccounts.map(presentAccount));
    } catch (error: any) {
        console.error("[Sync Error] Failed to sync accounts:", error?.response?.data || error);
        // Return the EXACT error message from Zernio SDK to the frontend UI
        res.status(500).json({ message: getErrorMessage(error, "Failed to sync accounts.") });
    }
};
// sync connected accounts from zernio into MongoDb
// GET /api/auth/sync
