export const platformValues = ["instagram", "facebook", "linkedin", "twitter", "youtube"] as const;
export type PlatformId = typeof platformValues[number];

export const freePlatformValues = ["instagram", "linkedin"] as const satisfies readonly PlatformId[];

const freePlatformSet = new Set<PlatformId>(freePlatformValues);

export const isKnownPlatform = (platform: unknown): platform is PlatformId =>
  platformValues.includes(platform as PlatformId);

export const isFreePlatform = (platform: unknown): platform is PlatformId =>
  isKnownPlatform(platform) && freePlatformSet.has(platform);

export const getLockedPlatforms = (platforms: unknown[]) =>
  platforms
    .filter(isKnownPlatform)
    .filter((platform) => !isFreePlatform(platform));

export const getPaidPlatformMessage = (platforms: string[]) =>
  `${platforms.join(", ")} ${platforms.length === 1 ? "is" : "are"} locked for Sociora 2.0 paid plans. Free launch supports Instagram and LinkedIn only.`;
