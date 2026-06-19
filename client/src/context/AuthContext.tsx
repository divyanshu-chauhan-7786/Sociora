import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { AuthContext } from "./auth-context";
import { authApi, authStorage, type AuthUser } from "../lib/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser());
  const [loading, setLoading] = useState(Boolean(authStorage.getToken()));

  useEffect(() => {
    if (!authStorage.getToken()) {
      return;
    }

    authApi.me()
      .then(({ user: currentUser }) => {
        authStorage.setUser(currentUser);
        setUser(currentUser);
      })
      .catch(() => {
        authStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login({ email, password });
    authStorage.setSession(session);
    setUser(session.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const session = await authApi.register({ name, email, password });
    authStorage.setSession(session);
    setUser(session.user);
  }, []);

  const startSocialLogin = useCallback((provider: "google" | "microsoft" | "facebook") => {
    window.location.assign(authApi.socialLoginUrl(provider));
  }, []);

  const updateUser = useCallback((nextUser: AuthUser) => {
    authStorage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, startSocialLogin, updateUser, logout }), [loading, login, logout, register, startSocialLogin, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
