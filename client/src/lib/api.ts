import type { ActivityItem, Generation, PlatformId, PlatformPost, ScheduledPost, SocialAccount, Tone } from "../types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  bio: string;
  profileImageUrl: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface DashboardResponse {
  stats: {
    scheduled: number;
    published: number;
    connectedAccounts: number;
    drafts: number;
    aiDrafts: number;
    failed: number;
    publishingHealth: number;
  };
  upcomingPosts: ScheduledPost[];
  activities: ActivityItem[];
}

export interface SettingsResponse {
  profile: AuthUser;
  workspace: {
    timezone: string;
    brandVoice: string;
    publishing: {
      urlShortening: boolean;
      approvalWorkflow: boolean;
    };
    notifications: {
      postFailAlerts: boolean;
      weeklyDigest: boolean;
    };
  };
}

export interface UnpublishPostResponse {
  deleted: boolean;
  deletedPlatforms: PlatformId[];
  failures?: Array<{ platform: PlatformId | string; message: string }>;
  post?: ScheduledPost;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_ORIGIN) {
  throw new Error("VITE_API_URL is not configured");
}

const API_BASE_URL = `${API_ORIGIN}/api`;
const TOKEN_KEY = "sociora.auth.token";
const USER_KEY = "sociora.auth.user";

export const authStorage = {
  getToken: () => window.localStorage.getItem(TOKEN_KEY),
  getUser: (): AuthUser | null => {
    const user = window.localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as AuthUser) : null;
  },
  setSession: ({ token, user }: AuthResponse) => {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser: (user: AuthUser) => {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = authStorage.getToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: init.credentials ?? "include",
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      authStorage.clear();
    }

    throw new ApiError(data.message ?? "Request failed", response.status);
  }

  return data as T;
};

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<{ user: AuthUser }>("/auth/me"),
  socialLoginUrl: (provider: "google" | "microsoft" | "facebook") =>
    `${API_BASE_URL}/auth/oauth/${provider}/start`,
};

export const dashboardApi = {
  get: () => request<DashboardResponse>("/dashboard"),
  clearActivity: () => request<void>("/dashboard/activity", { method: "DELETE" }),
};

export const realtimeApi = {
  getUrl: () => {
    const token = authStorage.getToken();
    return token ? `${API_BASE_URL}/realtime?token=${encodeURIComponent(token)}` : "";
  },
};

export const accountApi = {
  list: () => request<SocialAccount[]>("/accounts"),
  platformPosts: (platform?: PlatformId) => {
    const query = platform ? `?platform=${encodeURIComponent(platform)}` : "";
    return request<{ posts: PlatformPost[]; meta?: { accountsQueried?: number; accountsFailed?: number; lastUpdated?: string } }>(`/accounts/platform-posts${query}`);
  },
  connect: (platform: PlatformId) =>
    request<SocialAccount>("/accounts", {
      method: "POST",
      body: JSON.stringify({ platform }),
    }),
  disconnect: (id: string) => request<void>(`/accounts/${id}`, { method: "DELETE" }),
  getAuthUrl: (platform: PlatformId) => request<{ url: string }>(`/auth/social/${platform}`),
  sync: () => request<SocialAccount[]>("/auth/sync"),
};

export const postApi = {
  list: () => request<ScheduledPost[]>("/posts"),
  getMediaUploadUrl: (payload: { filename: string; contentType: string }) =>
    request<{ uploadUrl: string; publicUrl: string }>("/posts/media-upload-url", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  create: (post: Omit<ScheduledPost, "id" | "createdAt" | "updatedAt" | "publishedAt">) =>
    request<ScheduledPost>("/posts", { method: "POST", body: JSON.stringify(post) }),
  update: (id: string, post: Omit<ScheduledPost, "id" | "createdAt" | "updatedAt" | "publishedAt">) =>
    request<ScheduledPost>(`/posts/${id}`, { method: "PUT", body: JSON.stringify(post) }),
  delete: (id: string) => request<void>(`/posts/${id}`, { method: "DELETE" }),
  publish: (id: string) => request<ScheduledPost>(`/posts/${id}/publish`, { method: "POST" }),
  unpublish: (id: string, platforms: PlatformId[]) =>
    request<UnpublishPostResponse>(`/posts/${id}/unpublish`, {
      method: "POST",
      body: JSON.stringify({ platforms }),
    }),
};

export const generationApi = {
  list: () => request<Generation[]>("/generations"),
  create: (payload: { prompt: string; tone: Tone; generateImage: boolean }) =>
    request<Generation>("/generations", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: { prompt?: string; content?: string; tone?: Tone }) =>
    request<Generation>(`/generations/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  delete: (id: string) => request<void>(`/generations/${id}`, { method: "DELETE" }),
  suggestHashtags: (payload: { content: string; platforms: PlatformId[] }) =>
    request<{ hashtags: string[] }>("/generations/hashtags", { method: "POST", body: JSON.stringify(payload) }),
};

export const settingsApi = {
  get: () => request<SettingsResponse>("/settings"),
  update: (payload: SettingsResponse) =>
    request<SettingsResponse>("/settings", { method: "PUT", body: JSON.stringify(payload) }),
  updateProfilePhoto: (imageData: string) =>
    request<{ profile: AuthUser }>("/settings/profile-photo", {
      method: "POST",
      body: JSON.stringify({ imageData }),
    }),
};
