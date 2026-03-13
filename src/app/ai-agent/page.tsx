'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getWalletStateIfConnected } from '@/utils/web3';
import AIActions from '@/components/AIActions';
import type { AgentDecision } from '@/lib/xai-agent';

const OWNER = '0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b'.toLowerCase();

type LogEntry = { at: string; event: string; decisions?: number; raw?: string };

export default function AIAgentPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [humanApproval, setHumanApproval] = useState(true);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWalletStateIfConnected().then((s) => setWallet(s?.account ?? null));
  }, []);

  const isOwner = wallet ? wallet.toLowerCase() === OWNER : false;

  const runAgent = async () => {
    if (!isOwner || !wallet) return;
    setLoading(true);
    setError(null);
    try {
      let siteState = { userCount: 0, mintsTotal: 0, recentErrors: [] as string[] };
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) siteState = await statsRes.json();
      } catch {
        // use defaults
      }
      const res = await fetch('/api/ai-agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          ...siteState,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Run failed');
      setDecisions(data.decisions ?? []);
      setLogs((prev) => [...prev, ...(data.logs ?? [])]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run agent');
    } finally {
      setLoading(false);
    }
  };

  const executeDecision = async (d: AgentDecision) => {
    if (d.action !== 'social_post' || !d.platform) return;
    setExecuting(true);
    setError(null);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';
    const payload = {
      platform: d.platform,
      content: (d.content || `Nebula Nomads — cosmic NFT collection. Mint, explore, stake.`).trim(),
      link: d.link || siteUrl,
      imageUrl: d.imageUrl,
    };
    try {
      const res = await fetch('/api/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        const errMsg = result.error || 'Post failed';
        setError(errMsg);
        setLogs((prev) => [...prev, { at: new Date().toISOString(), event: `post_failed_${d.platform}`, raw: errMsg }]);
        return;
      }
      setLogs((prev) => [...prev, { at: new Date().toISOString(), event: `posted_${d.platform}`, raw: result.id || 'ok' }]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Request failed';
      setError(errMsg);
      setLogs((prev) => [...prev, { at: new Date().toISOString(), event: 'post_failed', raw: errMsg }]);
    } finally {
      setExecuting(false);
    }
  };

  if (wallet !== null && !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Access denied</h1>
          <p className="text-slate-400 mb-4">AI Agent Dashboard is owner-only. Connect the owner wallet to continue.</p>
          <Link href="/" className="text-neon-cyan hover:underline">Back home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Agent Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Autonomous control via xAI. Run on schedule (cron) or trigger manually. Owner-only.
            </p>
          </div>
          <Link href="/" className="text-neon-cyan text-sm hover:underline">← Home</Link>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              type="button"
              onClick={runAgent}
              disabled={loading || !wallet}
              className="rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 px-4 py-2 text-neon-cyan hover:bg-neon-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running…' : 'Run agent now'}
            </button>
            <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={humanApproval}
                onChange={(e) => setHumanApproval(e.target.checked)}
                className="rounded border-slate-600"
              />
              Human approval required (recommended)
            </label>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <p className="text-slate-500 text-xs mb-4">
            Env: XAI_API_KEY (server), AI_AGENT_OWNER_ADDRESS, CRON_SECRET for cron. Social: TWITTER_*, FACEBOOK_PAGE_ACCESS_TOKEN, INSTAGRAM_ACCESS_TOKEN. Rate limit: 1 post/day per platform.
          </p>

          <AIActions
            decisions={decisions}
            logs={logs}
            humanApprovalRequired={humanApproval}
            onExecute={executeDecision}
            isExecuting={executing}
          />
        </div>

        <div className="rounded-xl border border-slate-700 p-4 text-slate-500 text-xs">
          <strong className="text-slate-400">Cron:</strong> Vercel cron calls GET /api/ai-agent/cron with Authorization: Bearer CRON_SECRET. Add CRON_SECRET in Vercel env. Cron does not auto-post; use dashboard Execute for social.
        </div>
      </motion.div>
    </div>
  );
}
