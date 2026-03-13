'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AgentDecision } from '@/lib/xai-agent';

interface AIActionsProps {
  decisions: AgentDecision[];
  logs: Array<{ at: string; event: string; decisions?: number; raw?: string }>;
  humanApprovalRequired: boolean;
  onExecute?: (decision: AgentDecision) => void;
  isExecuting?: boolean;
}

/** Display AI agent decisions and optional approve/execute. */
export default function AIActions({
  decisions,
  logs,
  humanApprovalRequired,
  onExecute,
  isExecuting = false,
}: AIActionsProps) {
  const [approved, setApproved] = useState<Set<number>>(new Set());

  const toggleApproved = (i: number) => {
    setApproved((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold text-neon-cyan mb-2">Decisions</h2>
        {decisions.length === 0 ? (
          <p className="text-slate-500 text-sm">Run the agent to see decisions.</p>
        ) : (
          <ul className="space-y-3">
            {decisions.map((d, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-neon-purple font-mono text-sm">{d.action}</span>
                    {d.platform && <span className="ml-2 text-slate-400 text-xs">({d.platform})</span>}
                  </div>
                  {humanApprovalRequired && (
                    <button
                      type="button"
                      onClick={() => toggleApproved(i)}
                      className={`rounded px-2 py-1 text-xs ${approved.has(i) ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}
                    >
                      {approved.has(i) ? 'Approved' : 'Approve'}
                    </button>
                  )}
                </div>
                <p className="text-slate-300 text-sm mt-1">{d.reason}</p>
                {d.content && <p className="text-slate-400 text-xs mt-2 font-mono break-words">{d.content}</p>}
                {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-neon-cyan text-xs mt-1 inline-block hover:underline">{d.link}</a>}
                {d.action === 'social_post' && d.platform && onExecute && (!humanApprovalRequired || approved.has(i)) && (
                  <button
                    type="button"
                    onClick={() => onExecute(d)}
                    disabled={isExecuting}
                    className="mt-2 rounded border border-neon-cyan/50 px-3 py-1 text-xs text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-50"
                  >
                    {isExecuting ? 'Posting…' : `Post to ${d.platform}`}
                  </button>
                )}
                {d.action !== 'social_post' && (
                  <p className="mt-2 text-xs text-slate-500">Run via automation or manual update.</p>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-400 mb-2">Logs</h2>
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm">No runs yet.</p>
        ) : (
          <ul className="space-y-1 text-xs font-mono text-slate-500">
            {logs.slice(-10).reverse().map((l, i) => (
              <li key={i}>
                {l.at} — {l.event}
                {l.decisions != null && ` (${l.decisions} decisions)`}
                {l.raw && <span className="block truncate text-slate-600">{l.raw}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
