import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'default' | 'emergency';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerIcon,
  headerActions,
  children,
  footer,
  maxWidth = 'lg',
  variant = 'default'
}) => {
  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };

  const isEmergency = variant === 'emergency';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#121915] rounded-3xl shadow-2xl border ${
          isEmergency
            ? 'border-red-500/80 shadow-red-950/20'
            : 'border-slate-200 dark:border-[#1e2c25]'
        } overflow-hidden my-auto flex flex-col max-h-[90vh] z-10`}
      >
        {/* Header */}
        {(title || headerIcon || headerActions) && (
          <div
            className={`px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b ${
              isEmergency
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-50/70 dark:bg-[#17211c]/60 border-slate-200/80 dark:border-[#1e2c25]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {headerIcon && <span className="shrink-0">{headerIcon}</span>}
              <div className="min-w-0">
                {typeof title === 'string' ? (
                  <h3
                    className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                      isEmergency ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {title}
                  </h3>
                ) : (
                  title
                )}
                {subtitle && (
                  <p
                    className={`text-xs truncate ${
                      isEmergency ? 'text-red-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className={`p-1.5 rounded-xl transition-colors ${
                  isEmergency
                    ? 'hover:bg-red-700 text-white'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 sm:px-8 border-t border-slate-200/80 dark:border-[#1e2c25] bg-slate-50/50 dark:bg-[#17211c]/40 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
