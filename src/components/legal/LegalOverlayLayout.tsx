import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LegalOverlayLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
  acknowledgment?: string;
  copyright?: string;
}

export default function LegalOverlayLayout({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  acknowledgment = 'By using this workspace, you acknowledge and agree to these terms.',
  copyright = '© 2026 CareerTrack AI. All rights reserved.',
}: LegalOverlayLayoutProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTabTrap);
    return () => modal.removeEventListener('keydown', handleTabTrap);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop with Blur and Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40 dark:bg-background/60 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl lg:max-w-3xl bg-surface dark:bg-surface-container-lowest border-0 sm:border border-surface-container rounded-none sm:rounded-3xl shadow-premium flex flex-col overflow-hidden text-on-surface"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 md:p-8 border-b border-surface-container-high relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[26px]">{icon}</span>
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg md:text-xl font-black text-on-surface tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-on-surface-variant font-bold mt-0.5 tracking-wide">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors text-[20px]">
              close
            </span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6 space-y-4 scrollbar-thin select-text">
          {children}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-surface-container-high bg-surface-container-lowest dark:bg-surface-container-lowest/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[11px] text-on-surface-variant/80 font-bold max-w-md leading-relaxed">
            {acknowledgment}
          </p>
          <div className="flex flex-col items-start md:items-end gap-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-xl text-xs font-black shadow-sm transition-all hover:shadow cursor-pointer"
            >
              Acknowledge & Close
            </button>
            <span className="text-[10px] text-on-surface-variant/40 font-medium">
              {copyright}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
