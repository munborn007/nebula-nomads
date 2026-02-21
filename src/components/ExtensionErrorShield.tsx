'use client';

import { useEffect } from 'react';

/**
 * Catches wallet-extension errors that slip through so they don't trigger Next.js error overlay.
 * Runs on client mount as a backup to the beforeInteractive script.
 */
export default function ExtensionErrorShield() {
  useEffect(() => {
    const handle = (event: PromiseRejectionEvent) => {
      const r = event.reason;
      const msg = r?.message ?? r?.toString?.() ?? '';
      const stack = (r?.stack ?? '') + msg;
      const isExtension =
        /chrome-extension:\/\//.test(stack) ||
        /evmAsk\.js/.test(stack) ||
        (msg === 'Unexpected error' && /evmAsk|extension|request|selectExtension/.test(stack));
      if (isExtension) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('unhandledrejection', handle, true);
    return () => window.removeEventListener('unhandledrejection', handle, true);
  }, []);
  return null;
}
