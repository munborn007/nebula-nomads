'use client';

import Link from 'next/link';
import GlowingSocialIcon from './GlowingSocialIcon';

const SOCIAL = [
  { label: 'Discord', href: 'https://discord.gg/nebula-nomads', icon: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-neon-purple/30 bg-[#0a001a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Nebula Nomads. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-slate-500">Powered by xAI Vibes</p>
          </div>
          <div className="flex items-center gap-6">
            <GlowingSocialIcon size="md" className="hover:opacity-90" />
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition hover:text-neon-cyan"
              >
                {s.icon}
              </a>
            ))}
            <Link
              href="/faq"
              className="text-sm text-slate-400 transition hover:text-neon-purple"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
