import { createContext } from "react";

import type { AuthUser } from "../lib/api";

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  startSocialLogin: (provider: "google" | "microsoft" | "facebook") => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
