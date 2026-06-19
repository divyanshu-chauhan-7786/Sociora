import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { authStorage, type AuthUser } from "../lib/api";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [hasInvalidCallback, setHasInvalidCallback] = useState(false);
  const message = hasInvalidCallback
    ? "Social login could not be completed. Redirecting..."
    : "Completing secure sign in...";

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      window.setTimeout(() => {
        setHasInvalidCallback(true);
        navigate("/login", { replace: true });
      }, 1200);
      return;
    }

    try {
      const user = JSON.parse(userParam) as AuthUser;
      authStorage.setSession({ token, user });
      updateUser(user);
      navigate("/dashboard", { replace: true });
    } catch {
      window.setTimeout(() => {
        setHasInvalidCallback(true);
        navigate("/login", { replace: true });
      }, 1200);
    }
  }, [navigate, searchParams, updateUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
        <p className="mt-4 text-sm font-bold text-slate-600">{message}</p>
      </div>
    </div>
  );
}
