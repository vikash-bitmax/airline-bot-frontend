import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Operation',
  message = 'Are you sure you want to execute this operation?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xl">
        <div className="airmail-stripe-top" />
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${isDanger ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-[var(--text-main)] mono-font">
                {title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:bg-[var(--surface-input-active)] transition-colors mono-font"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors mono-font ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)]'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
