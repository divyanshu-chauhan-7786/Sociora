import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      {icon}
    </div>
    <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
      {description}
    </p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
