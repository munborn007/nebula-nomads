'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blog-posts';

const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1
          className="font-display text-3xl font-bold text-white sm:text-4xl"
          style={{ textShadow: '0 0 30px rgba(160,32,240,0.6)' }}
        >
          Blog & News
        </h1>
        <p className="mt-3 text-slate-400">Launches, roadmap updates, and community news.</p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {blogPosts.map((post) => (
          <motion.article key={post.id} variants={item}>
            <Link
              href={`/blog/${post.slug}`}
              className="block holo-card rounded-2xl p-6 transition hover:shadow-[0_0_40px_rgba(160,32,240,0.3),0_0_80px_rgba(0,255,255,0.15)]"
            >
              <h2 className="text-xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(0,255,255,0.3)' }}>
                {post.title}
              </h2>
              <p className="mt-2 text-slate-400 text-sm">{post.excerpt}</p>
              <p className="mt-4 text-xs text-slate-500">{post.date} · {post.author}</p>
            </Link>
          </motion.article>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-slate-500 text-sm"
      >
        Dynamic posts from Markdown or CMS coming soon.
      </motion.p>
    </div>
  );
}
