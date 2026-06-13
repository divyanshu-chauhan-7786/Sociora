import { useState } from "react";
import { Bell, Clock, KeyRound, Palette, ShieldCheck, User, Sparkles, Send, Globe, Moon, Sun, Monitor, UserRound, Camera, Mail, Briefcase, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/cn";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const TABS = [
  { id: "profile", label: "My Profile", icon: UserRound },
  { id: "general", label: "General", icon: Monitor },
  { id: "ai", label: "AI & Brand", icon: Sparkles },
  { id: "publishing", label: "Publishing", icon: Send },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// Custom Toggle Component
const Toggle = ({ checked, onChange, label, description }: { checked: boolean, onChange: (val: boolean) => void, label: string, description: string }) => (
  <div className="flex items-center justify-between py-1">
    <div className="pr-4">
      <p className="text-sm font-bold text-slate-950">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-100",
        checked ? "bg-teal-500" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("Divyanshu");
  const [email, setEmail] = useState("divyanshu@sociora.app");
  const [role, setRole] = useState("Marketing Manager");
  const [company, setCompany] = useState("Sociora");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const { theme, setTheme } = useTheme();
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  
  // Mock states for toggles
  const [urlShortening, setUrlShortening] = useState(true);
  const [approvalWorkflow, setApprovalWorkflow] = useState(false);
  const [postFailAlerts, setPostFailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 800);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl space-y-6"
    >
      {/* Header */}
      <motion.section variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Workspace Settings</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Manage your personal preferences, AI brand voice, and publishing automation rules.
          </p>
        </div>
        <Button icon={<KeyRound className="h-4 w-4" />}>Invite teammate</Button>
      </motion.section>

      {/* Main Layout (Sidebar + Content) */}
      <motion.div variants={item} className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        
        {/* Settings Sidebar */}
        <aside className="flex flex-row overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
          <nav className="flex min-w-max flex-row gap-1 md:w-full md:flex-col">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-teal-100",
                    isActive 
                      ? "bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <Card className="min-h-[500px] overflow-hidden rounded-[1.5rem] bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-6 sm:p-8"
            >
              
              {/* 0. PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Profile Information</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Update your photo and personal details.</p>

                    <div className="mt-6 flex items-center gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-950 text-2xl font-black text-white shadow-md">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Button variant="secondary" size="sm" icon={<Camera className="h-4 w-4" />}>
                          Change photo
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8 grid max-w-md gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Full name</label>
                        <div className="relative">
                          <UserRound className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Email address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input type="email" value={email} disabled className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 pl-11 pr-4 text-sm font-bold text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-500">Email cannot be changed directly. Contact support.</p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Role</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Marketing Manager" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Company</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Sociora Inc." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself..." className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900" />
                      </div>
                      
                      <div className="flex items-center gap-4 pt-2">
                        <Button disabled={isSaving} onClick={handleSaveProfile} icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}>
                          {isSaving ? "Saving..." : "Save changes"}
                        </Button>
                        <AnimatePresence>
                          {showSaved && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex items-center gap-1.5 text-sm font-bold text-green-600 dark:text-green-400"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Saved!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. GENERAL TAB */}
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Appearance</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Choose how Sociora looks to you.</p>
                    <div className="mt-5 inline-flex rounded-xl bg-slate-100 p-1">
                      {[{ id: "light", icon: Sun, label: "Light" }, { id: "dark", icon: Moon, label: "Dark" }, { id: "system", icon: Monitor, label: "System" }].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                            theme === t.id ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                          )}
                        >
                          <t.icon className="h-4 w-4" />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-lg font-black text-slate-950">Timezone</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">All your queued posts will be published relative to this timezone.</p>
                    <div className="mt-5 max-w-md relative">
                      <Globe className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <select 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                      >
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="Europe/London">Greenwich Mean Time (London)</option>
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Australia/Sydney">Australian Eastern Time (Sydney)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. AI & BRAND TAB */}
              {activeTab === "ai" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Brand Voice Instructions</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Sociora AI Composer will use these instructions as a base prompt for all your posts.</p>
                    <textarea 
                      className="mt-5 min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                      placeholder="E.g. We are a modern SaaS company. Always use 'We' instead of 'I'. Keep sentences short and punchy. Avoid using too many emojis..."
                      defaultValue="Always maintain a professional but approachable tone. Avoid buzzwords like 'synergy' or 'disrupt'. Use max 2-3 emojis per post."
                    />
                  </div>
                </div>
              )}

              {/* 3. PUBLISHING TAB */}
              {activeTab === "publishing" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Publishing Rules</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Configure how your content is processed before it goes live.</p>
                    <div className="mt-6 flex flex-col gap-6 rounded-xl border border-slate-100 bg-slate-50 p-6">
                      <Toggle 
                        label="Shorten links automatically" 
                        description="Sociora will convert long URLs in your posts into short tracking links." 
                        checked={urlShortening} 
                        onChange={setUrlShortening} 
                      />
                      <div className="h-px bg-slate-200/60" />
                      <Toggle 
                        label="Require admin approval" 
                        description="Posts created by team members must be approved before publishing." 
                        checked={approvalWorkflow} 
                        onChange={setApprovalWorkflow} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Email Notifications</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Choose what updates you want to receive in your inbox.</p>
                    <div className="mt-6 flex flex-col gap-6">
                      <Toggle label="Post Failure Alerts" description="Get notified immediately if a post fails to publish." checked={postFailAlerts} onChange={setPostFailAlerts} />
                      <Toggle label="Weekly Digest" description="Receive a summary of your scheduled and published content every Monday." checked={weeklyDigest} onChange={setWeeklyDigest} />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
