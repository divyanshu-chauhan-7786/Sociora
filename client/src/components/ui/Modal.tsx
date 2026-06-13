import type { ReactNode } from "react";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-950">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
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
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
