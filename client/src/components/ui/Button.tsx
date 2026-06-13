import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white shadow-sm shadow-slate-900/20 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/15 focus-visible:ring-teal-200",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/40 hover:text-teal-700 focus-visible:ring-teal-100",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-teal-100",
  danger:
    "bg-coral-50 text-coral-700 hover:bg-coral-100 focus-visible:ring-coral-200",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-11 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
      variantClass[variant],
      sizeClass[size],
      className,
    )}
    {...props}
  >
    {icon}
    {children}
  </button>
);
