export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan" />
    </div>
  );
}
