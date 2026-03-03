import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-white">404</h1>
      <p className="mt-2 text-slate-400">This page is lost in the nebula.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-6 py-2 text-neon-cyan hover:bg-neon-cyan/20"
      >
        Back to home
      </Link>
    </div>
  );
}
