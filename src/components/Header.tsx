'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import WalletConnectButton from './WalletConnectButton';

const NAV: { href: string; label: string; external?: boolean }[] = [
  { href: '/', label: 'Home' },
  { href: '/ar-viewer', label: 'AR Viewer' },
  { href: '/mint', label: 'Mint' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/about', label: 'About' },
  { href: '/community', label: 'Community' },
  { href: '/faq', label: 'FAQ' },
  { href: 'https://x.com/NomadsOfNebula', label: 'Twitter', external: true },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-neon-purple/30 bg-[#0a001a]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(160,32,240,0.15)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-display text-xl font-bold tracking-wide text-white glow-text"
            style={{ textShadow: '0 0 20px rgba(160,32,240,0.8), 0 0 40px rgba(255,0,255,0.4)' }}
          >
            Nebula Nomads
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const isExternal = !!item.external;
            const navContent = (
              <motion.span
                className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-neon-cyan'
                    : 'text-slate-300 hover:text-neon-purple'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
                {pathname === item.href && !isExternal && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-neon-cyan"
                    style={{ boxShadow: '0 0 10px currentColor' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.span>
            );
            return isExternal ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                {navContent}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {navContent}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <WalletConnectButton />
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-slate-300 transition hover:bg-neon-purple/20 hover:text-neon-purple"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-neon-purple/30 bg-[#0a001a]/95 flex flex-col gap-1 px-4 py-3 backdrop-blur-xl"
        >
          {NAV.map((item) => {
            const isExternal = !!item.external;
            const cls = `rounded-lg px-3 py-2 text-sm font-medium ${pathname === item.href && !isExternal ? 'text-neon-cyan' : 'text-slate-300'}`;
            return isExternal ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={cls}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cls}>
                {item.label}
              </Link>
            );
          })}
        </motion.nav>
      )}
    </header>
  );
}
