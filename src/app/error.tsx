'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold text-white">Something went wrong</h1>
      <p className="mt-2 max-w-md text-center text-slate-400">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-6 py-2 text-neon-cyan hover:bg-neon-cyan/20"
      >
        Try again
      </button>
      <Link href="/" className="mt-4 text-sm text-slate-500 hover:text-neon-cyan">
        ← Back to home
      </Link>
    </div>
  );
}
