import { MetadataRoute } from 'next';
import { nomads } from '@/data/nomads';
import { blogPosts } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/dashboard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/metaverse`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    ...blogPosts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${base}/explore`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/mint`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mint-1-20`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/buy-21-30`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/ar-viewer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/community`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...nomads.map((n) => ({ url: `${base}/nomads/${n.id}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
