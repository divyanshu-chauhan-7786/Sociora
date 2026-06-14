import { Menu, Search, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { pageMeta } from "../constants/navigation";
import Sidebar from "./Sidebar";
import { Button } from "./ui/Button";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/cn";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? pageMeta["/dashboard"];

  // Initialize theme globally
  useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-[#f8fafc] text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={isSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={cn(
              "sticky top-0 z-30 transition-all duration-300",
              isScrolled
                ? "border-b border-slate-200 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-slate-900/40"
                : "border-b border-transparent bg-transparent dark:border-transparent"
            )}
          >
            <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
              <Button
                aria-label="Open mobile menu"
                className="md:hidden"
                icon={<Menu className="h-5 w-5" />}
                onClick={() => setIsMobileMenuOpen(true)}
                size="icon"
                variant="ghost"
              />
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-black text-slate-950 dark:text-white">{meta.title}</h1>
                <p className="mt-1 hidden text-sm font-semibold text-slate-500 sm:block">
                  {meta.eyebrow}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden h-10 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f0fdfa)] px-3 text-sm font-semibold text-slate-400 transition-all focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-100 lg:flex">
                  <Search className="h-4 w-4 shrink-0 text-teal-600" />
                  <input
                    type="text"
                    placeholder="Search content, posts..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <Link
                  to="/"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/40 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default Layout;
