'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnectButton from './WalletConnectButton';
import LiveOnSepoliaBadge from './LiveOnSepoliaBadge';

const PRIMARY_NAV: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/metaverse', label: 'Metaverse' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profile', label: 'Profile' },
];

const MINT_NAV: { href: string; label: string }[] = [
  { href: '/mint', label: 'Mint' },
  { href: '/mint-1-20', label: 'Mint 1–20' },
  { href: '/buy-21-30', label: 'Buy 21–30' },
];

const MORE_NAV: { href: string; label: string; external?: boolean }[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/ar-viewer', label: 'AR Viewer' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/about', label: 'About' },
  { href: '/community', label: 'Community' },
  { href: '/faq', label: 'FAQ' },
  { href: 'https://x.com/NomadsOfNebula', label: 'Twitter', external: true },
];

function NavLink({
  href,
  label,
  pathname,
  isExternal,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  isExternal?: boolean;
  onClick?: () => void;
}) {
  const active = !isExternal && pathname === href;
  const content = (
    <span
      className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-purple'
      }`}
    >
      {label}
      {active && (
        <span
          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-neon-cyan"
          style={{ boxShadow: '0 0 10px currentColor' }}
          aria-hidden
        />
      )}
    </span>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className="relative" onClick={onClick}>
      {content}
    </Link>
  );
}

function Dropdown({
  label,
  items,
  pathname,
  open,
  onOpenChange,
}: {
  label: string;
  items: { href: string; label: string; external?: boolean }[];
  pathname: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);

  const isActive = items.some((i) => !i.external && pathname === i.href);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        onFocus={() => onOpenChange(true)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${label} menu`}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'text-neon-cyan' : 'text-slate-300 hover:text-neon-purple'
        }`}
      >
        {label} ▾
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-neon-purple/30 bg-[#0a001a]/95 py-2 shadow-xl backdrop-blur-xl"
            role="menu"
          >
            {items.map((item) => (
              <li key={item.href} role="none">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-neon-purple/20 hover:text-neon-cyan"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={`block px-4 py-2 text-sm hover:bg-neon-purple/20 hover:text-neon-cyan ${
                      pathname === item.href ? 'text-neon-cyan' : 'text-slate-300'
                    }`}
                    onClick={() => onOpenChange(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mintOpen, setMintOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const setMintOpenAndCloseMore = (v: boolean) => {
    setMintOpen(v);
    if (v) setMoreOpen(false);
  };
  const setMoreOpenAndCloseMint = (v: boolean) => {
    setMoreOpen(v);
    if (v) setMintOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-neon-purple/30 bg-[#0a001a]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(160,32,240,0.15)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="font-display text-xl font-bold tracking-wide text-white glow-text"
            style={{ textShadow: '0 0 20px rgba(160,32,240,0.8), 0 0 40px rgba(255,0,255,0.4)' }}
          >
            Nebula Nomads
          </span>
        </Link>

        {/* Desktop: primary + Mint dropdown + More dropdown */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} pathname={pathname} />
              </li>
            ))}
            <li>
              <Dropdown
                label="Mint"
                items={MINT_NAV}
                pathname={pathname}
                open={mintOpen}
                onOpenChange={setMintOpenAndCloseMore}
              />
            </li>
            <li>
              <Dropdown
                label="More"
                items={MORE_NAV}
                pathname={pathname}
                open={moreOpen}
                onOpenChange={setMoreOpenAndCloseMint}
              />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LiveOnSepoliaBadge />
          <WalletConnectButton />
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-slate-300 transition hover:bg-neon-purple/20 hover:text-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile: full menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neon-purple/30 bg-[#0a001a]/95 backdrop-blur-xl overflow-hidden"
            aria-label="Mobile menu"
          >
            <ul className="flex flex-col px-4 py-3 gap-0.5">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      pathname === item.href ? 'text-neon-cyan' : 'text-slate-300 hover:bg-neon-purple/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-slate-700/50">
                <span className="px-3 py-1 text-xs font-medium uppercase text-slate-500">Mint</span>
              </li>
              {MINT_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm ${
                      pathname === item.href ? 'text-neon-cyan' : 'text-slate-300 hover:bg-neon-purple/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-slate-700/50">
                <span className="px-3 py-1 text-xs font-medium uppercase text-slate-500">More</span>
              </li>
              {MORE_NAV.map((item) =>
                item.external ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-neon-purple/10"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm ${
                        pathname === item.href ? 'text-neon-cyan' : 'text-slate-300 hover:bg-neon-purple/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
