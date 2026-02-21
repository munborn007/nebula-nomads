import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads.vercel.app';
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  };
}
