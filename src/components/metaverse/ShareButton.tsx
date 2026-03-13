'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/** Capture game canvas and share to Twitter. Viral hook for battle clips / screenshots. */
export default function ShareButton() {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(
          `<html><head><title>Nebula Nomads Metaverse</title></head><body style="margin:0;background:#0a0a12;"><img src="${dataUrl}" alt="Nebula Metaverse" style="max-width:100%;height:auto;"/><p style="color:#888;font-family:sans-serif;padding:12px;">Share this screenshot — play at <a href="https://nebula-nomads-ci2j.vercel.app/metaverse">nebula-nomads-ci2j.vercel.app/metaverse</a></p></body></html>`
        );
        w.document.close();
      }
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Just played Nebula Metaverse — cosmic NFT game. Try it!')}&url=${encodeURIComponent('https://nebula-nomads-ci2j.vercel.app/metaverse')}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleShare}
      className="holo-card rounded-xl px-4 py-2 text-sm text-neon-cyan hover:bg-neon-cyan/10 transition pointer-events-auto"
      whileTap={{ scale: 0.98 }}
    >
      {shared ? '✓ Shared!' : '📸 Share to Twitter'}
    </motion.button>
  );
}
