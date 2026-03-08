'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/** AI-custom Nomad generator — xAI API placeholder. */
export default function AIGeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    // xAI API placeholder — integrate when endpoint available
    await new Promise((r) => setTimeout(r, 1500));
    setResult(`Generated traits for: "${prompt.slice(0, 50)}..." — xAI API integration coming soon. Export to GLB for metaverse.`);
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="holo-card rounded-2xl p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-bold text-neon-cyan">AI Custom Nomad Generator</h3>
      <p className="text-slate-400 text-sm">
        Describe your Nomad — traits, lore, abilities. xAI placeholder. Export to glb for metaverse.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Cosmic warrior with nebula cloak, speed 90, legendary rarity..."
        className="w-full h-24 rounded-lg bg-black/40 border border-neon-cyan/30 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-holo rounded-lg px-6 py-3 text-neon-cyan font-medium disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && <p className="text-slate-300 text-sm">{result}</p>}
    </motion.form>
  );
}
