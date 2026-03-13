'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateZoneFromPrompt } from '@/lib/xai-procedural';

/** AI Zone Generator — prompt → procedural zone (stub; xAI API for production). */
export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ name: string; theme: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setGenerated(null);
    try {
      const res = await fetch('/api/generate-zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const zone = res.ok ? await res.json() : await generateZoneFromPrompt(prompt);
      setGenerated({ name: zone.name, theme: zone.theme });
    } catch {
      const zone = await generateZoneFromPrompt(prompt);
      setGenerated({ name: zone.name, theme: zone.theme });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="holo-card rounded-2xl p-6 border border-neon-cyan/30"
    >
      <h2 className="text-lg font-bold text-neon-cyan mb-2">AI Zone Generator</h2>
      <p className="text-slate-400 text-sm mb-4">
        Describe a zone — xAI generates procedural 3D island. Export to glb/Unity. Coming with xAI API.
      </p>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Crystal nebula with pulsar core, floating crystals..."
        className="w-full rounded-lg bg-black/40 border border-neon-cyan/30 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
        disabled={loading}
      />
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="btn-holo rounded-lg px-4 py-2 text-sm text-neon-cyan disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {generated && (
          <span className="text-sm text-neon-cyan">
            Zone: {generated.name} ({generated.theme})
          </span>
        )}
        <span className="rounded-lg border border-slate-600 px-4 py-2 text-xs text-slate-500 self-center">
          xAI API for full gen
        </span>
      </div>
    </motion.form>
  );
}
