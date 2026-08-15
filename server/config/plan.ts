export const platformValues = ["instagram", "facebook", "linkedin", "twitter", "youtube"] as const;
export type PlatformId = typeof platformValues[number];

export const freePlatformValues = ["instagram", "linkedin", "facebook", "twitter", "youtube"] as const satisfies readonly PlatformId[];

const freePlatformSet = new Set<PlatformId>(freePlatformValues);

export const isKnownPlatform = (platform: unknown): platform is PlatformId =>
  platformValues.includes(platform as PlatformId);

export const isFreePlatform = (platform: unknown): platform is PlatformId =>
  isKnownPlatform(platform) && freePlatformSet.has(platform);

export const getLockedPlatforms = (_platforms: unknown[]) => [];

export const getPaidPlatformMessage = (_platforms: string[]) => "";
