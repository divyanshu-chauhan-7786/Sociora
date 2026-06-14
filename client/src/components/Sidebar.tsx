import { ChevronLeft, ChevronRight, LogOut, Settings, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { navigationItems } from "../constants/navigation";
import { cn } from "../utils/cn";
import { Button } from "./ui/Button";

interface SidebarProps {
  collapsed: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
}

const user = {
  name: "Divyanshu",
  email: "divyanshu@sociora.app",
};

const SidebarContent = ({
  collapsed,
  onMobileClose,
  onToggleCollapse,
}: Omit<SidebarProps, "isMobileOpen">) => (
  <div className="flex h-full flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
    <div className="flex min-h-20 items-center justify-between border-b border-slate-100 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span
                className="text-3xl font-black italic leading-none tracking-tight bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm select-none"
                style={{ fontFamily: "'Pacifico', 'Lobster', cursive" }}
              >
                Sociora
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button
        aria-label="Close sidebar"
        className="md:hidden"
        icon={<X className="h-4 w-4" />}
        onClick={onMobileClose}
        size="icon"
        variant="ghost"
      />
    </div>

    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              cn(
                "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[linear-gradient(135deg,#fff1f2,#f0fdfa)] text-slate-950 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )
            }
            key={item.path}
            onClick={onMobileClose}
            title={collapsed ? item.name : undefined}
            to={item.path}
          >
            {({ isActive }) => (
              <>
            {isActive ? (
              <motion.span layoutId="sidebar-active-indicator" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-coral-500" />
            ) : null}
                <Icon className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: 10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: 10 }}
          className="px-4 pb-4 overflow-hidden"
        >
          <div className="rounded-lg border border-teal-100 bg-[linear-gradient(135deg,#fff1f2,#f0fdfa_58%,#fffbeb)] p-4">
            <p className="text-sm font-black text-slate-950">Launch readiness</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
              4 posts queued, 3 channels healthy, AI drafts ready for review.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="border-t border-slate-100 p-3">
      <div className={cn("flex items-center gap-3 rounded-lg bg-slate-50 p-3", collapsed && "justify-center")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
          {user.name.charAt(0)}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
            >
              <p className="truncate text-sm font-black text-slate-950">{user.name}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 grid grid-cols-2 gap-2 overflow-hidden"
          >
            <NavLink
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/40 hover:text-teal-700"
              to="/settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-coral-50 px-3 text-sm font-bold text-coral-700 transition hover:bg-coral-100"
              onClick={() => {
                window.location.href = "/";
              }}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="mt-3 hidden w-full md:flex"
        icon={collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        onClick={onToggleCollapse}
        variant="ghost"
      >
        {!collapsed && "Collapse"}
      </Button>
    </div>
  </div>
);

const Sidebar = ({ collapsed, isMobileOpen, onMobileClose, onToggleCollapse }: SidebarProps) => (
  <>
    <AnimatePresence>
      {isMobileOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Close mobile menu"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          type="button"
        />
      )}
    </AnimatePresence>

    <motion.aside
      layout
      initial={false}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none md:transition-none overflow-hidden dark:border-slate-800 dark:bg-slate-900",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "md:w-20" : "md:w-72",
      )}
    >
      <SidebarContent
        collapsed={collapsed}
        onMobileClose={onMobileClose}
        onToggleCollapse={onToggleCollapse}
      />
    </motion.aside>
  </>
);

export default Sidebar;
