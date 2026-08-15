import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, description, children, footer, onClose }: ModalProps) => {
  useBodyScrollLock(true);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="relative z-10 max-h-[85vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div>
            <h2 id="modal-title" className="text-xl font-black text-slate-950 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
          <Button
            aria-label="Close modal"
            className="shrink-0"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            size="icon"
            variant="ghost"
          />
        </div>
        <div className="max-h-[calc(85vh-9rem)] overflow-y-auto px-6 py-5 flex-1">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
