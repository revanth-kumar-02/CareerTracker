import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 28,
      mass: 0.9,
      delay: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.055, duration: 0.32, ease: 'easeOut' },
  }),
};

export default function SupportOverlay({ isOpen, onClose }: SupportOverlayProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const bulletPoints = [
    { icon: 'route', text: 'Exploring roadmap paths' },
    { icon: 'record_voice_over', text: 'Practicing interview questions' },
    { icon: 'description', text: 'Improving your resume' },
    { icon: 'school', text: 'Learning new concepts' },
    { icon: 'star', text: 'Building your dream career' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="support-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-on-surface/30 backdrop-blur-[6px]"
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              key="support-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Support and Help"
              className="pointer-events-auto relative w-full max-w-xl max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-3xl shadow-2xl bg-surface border border-surface-container-high support-overlay-panel"
              style={{
                boxShadow: '0 8px 64px rgba(99,73,233,0.13), 0 2px 24px rgba(0,0,0,0.10)',
              }}
            >
              {/* Animated gradient accent border top */}
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full support-gradient-line"
                aria-hidden="true"
              />

              {/* Subtle background glow blob */}
              <div
                className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-[-40px] left-[-40px] w-36 h-36 rounded-full bg-secondary/8 blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* ── Content ─────────────────────────────── */}
              <div className="relative z-10 p-8 sm:p-10 space-y-8">

                {/* ── Header ─────────────────────────────── */}
                <motion.div
                  custom={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon bubble */}
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shadow-sm flex-shrink-0 support-icon-pulse">
                      <span className="material-symbols-outlined text-primary text-[24px] leading-none">support_agent</span>
                    </div>
                    <div>
                      <h2 className="text-[22px] font-black text-on-surface leading-tight tracking-tight">
                        Need Guidance? 👋
                      </h2>
                      <p className="text-[11px] text-on-surface-variant font-semibold mt-1 tracking-wide">
                        CareerTrack AI · Help &amp; Support Center
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex-shrink-0 shadow-sm"
                    aria-label="Close support panel"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div
                  custom={1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="h-px bg-surface-container-high"
                />

                {/* ── Main Message ─────────────────────────── */}
                <motion.div
                  custom={2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <p className="text-[13.5px] text-on-surface font-medium leading-[1.75] tracking-[0.01em]">
                    CareerTrack AI was built to help learners confidently navigate their career journey — from discovering modern tech roles to mastering skills, building projects, preparing for interviews, and achieving career goals step-by-step.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <p className="text-[11px] text-on-surface-variant font-extrabold uppercase tracking-widest">
                      Whether you're…
                    </p>
                    <ul className="space-y-3">
                      {bulletPoints.map((bp, i) => (
                        <motion.li
                          key={bp.text}
                          custom={3 + i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-3 text-[13px] text-on-surface font-medium"
                        >
                          <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-[15px] leading-none">{bp.icon}</span>
                          </span>
                          {bp.text}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[13.5px] text-on-surface font-medium leading-[1.75] pt-1">
                    This platform is designed to guide and support your growth throughout the journey.
                  </p>

                  <p className="text-[13px] text-on-surface-variant font-medium leading-relaxed">
                    If you encounter bugs, UI issues, roadmap confusion, or have ideas to improve the platform, feel free to reach out through the support options available inside the application.
                  </p>
                </motion.div>

                {/* ── Contact Card ─────────────────────────── */}
                <motion.div
                  custom={9}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl border border-primary/15 bg-primary/5 p-6 space-y-4"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[16px] leading-none">contact_support</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Further Assistance</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Avatar initial */}
                    <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-black text-primary">M</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-on-surface">S Mercina Gifty</p>
                      <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Creator &amp; Developer</p>
                    </div>
                  </div>

                  <a
                    href="mailto:mercysam232007@gmail.com"
                    className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-surface border border-surface-container-high hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group cursor-pointer"
                    aria-label="Send email to S Mercina Gifty"
                  >
                    <span className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-[16px] leading-none">mail</span>
                    </span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-semibold">Email Address</p>
                      <p className="text-[13px] text-primary font-bold group-hover:underline">mercysam232007@gmail.com</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary/60 text-[16px] ml-auto transition-colors">open_in_new</span>
                  </a>
                </motion.div>

                {/* ── Footer ─────────────────────────────── */}
                <motion.div
                  custom={10}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-1 flex items-center justify-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-[13px] text-on-surface-variant/40">shield</span>
                  <p className="text-[10.5px] text-on-surface-variant/50 font-medium tracking-wide">
                    © 2026 CareerTrack AI — All Rights Reserved to S Mercina Gifty.
                  </p>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
