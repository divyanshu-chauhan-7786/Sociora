import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, LockIcon, MailIcon, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters, start with an uppercase letter, and include a special character.";
const PASSWORD_PATTERN = /^[A-Z](?=.*[^A-Za-z0-9\s]).{7,}$/;

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const Instagram = ({ size = 24, strokeWidth = 2, className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 24, strokeWidth = 2, className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Twitter = ({ size = 24, className = "" }: Omit<IconProps, "strokeWidth">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-login" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-login)" />
      </svg>
      
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "750px",
          height: "750px",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, rgba(239,68,68,0.05) 40%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/5 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -30, 10, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-red-500/10 to-pink-500/5 blur-[100px]"
      />

      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[12%] text-pink-500/20"
      >
        <Instagram size={100} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, -25, 0], x: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[15%] right-[15%] text-sky-600/20"
      >
        <Linkedin size={90} strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 25, 0], x: [0, 25, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[18%] left-[18%] text-slate-500/15"
      >
        <Twitter size={95} />
      </motion.div>
    </div>
  );
}

export default function Login() {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register, startSocialLogin, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const oauthError = searchParams.get("error") ?? "";
  const visibleError = error || oauthError;

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!loginState && !PASSWORD_PATTERN.test(password)) {
      setLoading(false);
      setError(PASSWORD_REQUIREMENTS);
      return;
    }

    try {
      if (loginState) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }

      setLoading(false);
      navigate("/dashboard");
    } catch (requestError) {
      setLoading(false);
      setError(requestError instanceof Error ? requestError.message : "Authentication failed");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6"
    >
      <GridBackground />

      <motion.div 
        className="relative w-full max-w-md sm:max-w-lg z-10"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Gradient Glow behind the form */}
        <motion.div 
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1 z-0 rounded-[2.5rem] bg-[linear-gradient(270deg,#ef4444,#f97316,#f59e0b,#ef4444)] bg-[length:200%_200%] opacity-35 blur-xl sm:blur-2xl"
        />

        {/* Main Centered Glassmorphic Form Card */}
        <div className="relative z-10 bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/70 dark:border-white/10 rounded-[2.2rem] shadow-2xl p-7 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <Link to="/" className="group inline-block transition-transform hover:-translate-y-0.5 mb-2">
              <span 
                className="text-4xl font-black italic tracking-tight bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm select-none"
                style={{ fontFamily: "'Pacifico', 'Lobster', cursive" }}
              >
                Sociora
              </span>
            </Link>
            <h2 className="text-xl font-black text-slate-950 dark:text-white mt-1">
              {loginState ? "Sign in to workspace" : "Create your free account"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm mt-1">
              {loginState ? "Manage your campaigns, AI drafts & social calendar" : "Start scheduling & drafting AI captions today"}
            </p>
          </div>

          {/* Continue with Google Single-Provider Button */}
          <div className="mb-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => startSocialLogin("google")}
              className="group flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-white/10 rounded-xl text-sm font-black text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" className="flex-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </motion.button>
          </div>

          {/* Sleek Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
            <AnimatePresence initial={false}>
              {!loginState && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-1">
                    <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200 text-xs">Name</label>
                    <div className="relative">
                      <User2Icon className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        required={!loginState} 
                        placeholder="Enter your name" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-800/60 outline-none border border-slate-200 dark:border-white/10 rounded-xl transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-slate-900 dark:text-white" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200 text-xs">Email</label>
              <div className="relative">
                <MailIcon className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  placeholder="you@company.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-800/60 outline-none border border-slate-200 dark:border-white/10 rounded-xl transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-slate-900 dark:text-white" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-200 text-xs">Password</label>
              <div className="relative">
                <LockIcon className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  placeholder="********" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 dark:bg-slate-800/60 outline-none border border-slate-200 dark:border-white/10 rounded-xl transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-slate-900 dark:text-white" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                {PASSWORD_REQUIREMENTS}
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading} 
              className="group w-full py-3.5 px-4 bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                "Please wait..."
              ) : (
                <>
                  {loginState ? "Sign in to workspace" : "Create free account"} 
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>

            {visibleError && (
              <p className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">
                {visibleError}
              </p>
            )}
          </form>

          {/* Toggle between Sign in & Register */}
          <div className="mt-6 text-center text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {loginState ? (
              <>
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => setLoginState(false)} 
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-bold transition-colors"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => setLoginState(true)} 
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-bold transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
