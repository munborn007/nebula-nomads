'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPostBySlug } from '@/data/blog-posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 pt-24">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="holo-modal rounded-2xl p-8"
      >
        <Link href="/blog" className="text-neon-cyan hover:underline text-sm mb-6 inline-block">← Blog</Link>
        <h1
          className="text-2xl sm:text-3xl font-bold text-white mt-2"
          style={{ textShadow: '0 0 20px rgba(160,32,240,0.5)' }}
        >
          {post.title}
        </h1>
        <p className="mt-2 text-slate-500 text-sm">{post.date} · {post.author}</p>
        <div className="mt-8 prose prose-invert max-w-none space-y-4">
          {paragraphs.map((p, i) => {
            const trimmed = p.trim();
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
              return (
                <h3 key={i} className="text-lg font-semibold text-neon-cyan">
                  {trimmed.replace(/\*\*/g, '')}
                </h3>
              );
            }
            return (
              <p key={i} className="text-slate-300 leading-relaxed">
                {trimmed.replace(/\*\*(.+?)\*\*/g, '$1')}
              </p>
            );
          })}
        </div>
        <div className="mt-10">
          <Link href="/blog" className="holo-card inline-flex rounded-xl px-4 py-2 text-neon-cyan hover:text-white transition">
            ← All posts
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
