'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/** AI Zone Generator — xAI prompt → procedural 3D island, export glb. */
export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPrompt('');
    }, 1500);
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
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="btn-holo rounded-lg px-4 py-2 text-sm text-neon-cyan disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <span className="rounded-lg border border-slate-600 px-4 py-2 text-xs text-slate-500 self-center">
          xAI API soon
        </span>
      </div>
    </motion.form>
  );
}
