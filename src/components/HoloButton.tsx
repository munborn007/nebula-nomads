'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HoloButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'purple' | 'pink' | 'cyan' | 'orange' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export default function HoloButton({
  children,
  href,
  onClick,
  variant = 'gradient',
  size = 'md',
  pulse = true,
  className = '',
}: HoloButtonProps) {
  const base =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-lg border transition-all duration-300';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const variants = {
    purple:
      'bg-neon-purple/20 border-neon-purple text-white hover:bg-neon-purple/40 hover:shadow-[0_0_25px_rgba(160,32,240,0.6)]',
    pink:
      'bg-neon-pink/20 border-neon-pink text-white hover:bg-neon-pink/40 hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]',
    cyan:
      'bg-neon-cyan/20 border-neon-cyan text-black hover:bg-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]',
    orange:
      'bg-neon-orange/20 border-neon-orange text-white hover:bg-neon-orange/40 hover:shadow-[0_0_25px_rgba(255,69,0,0.6)]',
    gradient:
      'bg-gradient-to-r from-neon-purple/40 to-neon-pink/40 border-neon-purple/60 text-white hover:from-neon-purple/60 hover:to-neon-pink/60 hover:shadow-[0_0_30px_rgba(160,32,240,0.5),0_0_50px_rgba(255,0,255,0.3)]',
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${pulse ? 'animate-pulse-glow' : ''} ${className}`;

  const content = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
