'use client';

import { motion } from 'framer-motion';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'pink' | 'cyan' | 'orange';
  delay?: number;
  yoyo?: boolean;
}

export default function NeonCard({
  children,
  className = '',
  glowColor = 'purple',
  delay = 0,
  yoyo = true,
}: NeonCardProps) {
  const glowMap = {
    purple: 'shadow-[0_0_20px_rgba(160,32,240,0.4)] hover:shadow-[0_0_30px_rgba(160,32,240,0.6)]',
    pink: 'shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]',
    cyan: 'shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]',
    orange: 'shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={yoyo ? { y: [0, -10, 0] } : undefined}
      transition={{
        opacity: { duration: 0.5, delay },
        y: yoyo ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.5, delay },
      }}
      whileHover={{ scale: 1.05 }}
      className={`holo-card-depth rounded-xl p-4 transition-shadow duration-300 ${glowMap[glowColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
