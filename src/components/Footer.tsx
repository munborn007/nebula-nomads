'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlowingSocialIcon from './GlowingSocialIcon';
import AirdropTeaserModal from './AirdropTeaserModal';

const DISCORD_URL = 'https://discord.gg/nebula-nomads';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-neon-purple/30 bg-[#020408]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Nebula Nomads. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-neon-cyan/80">Powered by xAI</p>
            <p className="mt-2 text-xs text-slate-500">
              Refer friends — mint discount coming soon.{' '}
              <AirdropTeaserModal />
            </p>
          </div>
          <div className="flex items-center gap-6">
            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <GlowingSocialIcon size="md" className="hover:opacity-90" />
            </motion.span>
            <motion.a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition hover:text-neon-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg font-semibold">Discord</span>
            </motion.a>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/faq"
                className="text-sm text-slate-400 transition hover:text-neon-purple"
              >
                FAQ
              </Link>
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  );
}
