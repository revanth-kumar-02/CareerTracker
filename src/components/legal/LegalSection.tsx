import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalSectionProps {
  number: number;
  title: string;
  icon: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

export default function LegalSection({
  number,
  title,
  icon,
  isOpen: initialIsOpen = false,
  children,
}: LegalSectionProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  return (
    <div className="border border-surface-container-high rounded-2xl bg-surface-container-lowest/40 dark:bg-surface-container-lowest/10 overflow-hidden transition-all duration-200 hover:border-primary/20">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer transition-all hover:bg-surface-container/30 focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5 pr-4">
          {/* Circular number / icon badge */}
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-surface-container-high text-primary/80 font-extrabold text-xs">
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
          </div>
          <div>
            <span className="text-[10px] text-primary/80 font-black tracking-wider uppercase">
              Section {number}
            </span>
            <h3 className="text-sm font-black text-on-surface tracking-tight mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Expand/Collapse Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
        </motion.div>
      </button>

      {/* Expandable Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-surface-container/40 text-xs md:text-[13px] text-on-surface-variant leading-relaxed font-semibold space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
