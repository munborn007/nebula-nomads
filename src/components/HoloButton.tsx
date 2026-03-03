'use client';

import { useState, useRef } from 'react';
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
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const base =
    'btn-holo relative inline-flex items-center justify-center font-bold tracking-wide rounded-lg transition-all duration-300 overflow-hidden';
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

  const handleTap = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 500);
    if (!href) onClick?.();
  };

  const content = (
    <>
      {ripple && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full bg-neon-cyan/30"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{
            width: 400,
            height: 400,
            x: ripple.x - 200,
            y: ripple.y - 200,
            opacity: 0,
          }}
          transition={{ duration: 0.5 }}
          style={{ borderRadius: '50%' }}
        />
      )}
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 inline-block"
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={classes} onClick={handleTap}>
        {content}
      </Link>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} type="button" onClick={handleTap} className={classes}>
      {content}
    </button>
  );
}
