'use client';

import { motion } from 'framer-motion';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  /** Only apply glitch on hover (subtle by default). */
  glitchOnHover?: boolean;
}

/**
 * Cyberpunk glitch text: dual-layer RGB shift + optional hover intensity.
 * Uses CSS animation + Framer Motion for stagger/entrance.
 */
export default function GlitchText({ children, className = '', glitchOnHover = true }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : '';
  return (
    <motion.span
      className={`glitch-text-wrapper inline-block ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span
        className={`glitch-text ${glitchOnHover ? 'glitch-text-hover' : ''}`}
        data-text={text}
      >
        {children}
      </span>
    </motion.span>
  );
}
