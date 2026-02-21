'use client';

import { motion } from 'framer-motion';

const TWITTER_URL = 'https://x.com/NomadsOfNebula';

interface GlowingSocialIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Neon X logo linking to @NomadsOfNebula on X (Twitter) */
export default function GlowingSocialIcon({ className = '', size = 'md' }: GlowingSocialIconProps) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };
  return (
    <motion.a
      href={TWITTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center font-bold text-white transition-colors ${sizes[size]} ${className}`}
      style={{
        textShadow: '0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(160,32,240,0.5)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = '0 0 25px rgba(0,255,255,1), 0 0 50px rgba(255,0,255,0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = '0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(160,32,240,0.5)';
      }}
      aria-label="Follow @NomadsOfNebula on X (Twitter)"
    >
      𝕏
    </motion.a>
  );
}
