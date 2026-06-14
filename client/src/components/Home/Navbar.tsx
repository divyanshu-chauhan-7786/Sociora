import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
  { label: "Stories", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:px-5">
        <Link
          className="group flex items-center gap-3 flex-shrink-0"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsOpen(false);
          }}
          to="/"
        >
          <div className="flex flex-col">
            <span
              className="
      text-3xl
      font-black
      italic
      leading-none
      tracking-tight
      bg-gradient-to-r
      from-red-500
      via-orange-500
      to-amber-500
      bg-clip-text
      text-transparent
      drop-shadow-sm
      select-none
    "
              style={{
                fontFamily:
                  "'Pacifico', 'Lobster', cursive",
              }}
            >
              Sociora
            </span>

            
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-slate-800/60 bg-slate-900/50 p-1 md:flex">
          {navItems.map((item) => (
            <a
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 hover:shadow-sm"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="text-sm font-bold text-slate-400 transition hover:text-white"
            to="/login"
          >
            Sign in
          </Link>
          <Link
            className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
            to="/login"
          >
            Launch app
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="animate-menu-drop mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-black/40 md:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <a
                className="rounded-xl px-3 py-3 text-sm font-black text-slate-400 transition hover:bg-slate-900 hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 text-sm font-black text-slate-300 hover:bg-slate-900 hover:text-white"
              onClick={() => setIsOpen(false)}
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-sm font-black text-white"
              onClick={() => setIsOpen(false)}
              to="/login"
            >
              Launch app
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
