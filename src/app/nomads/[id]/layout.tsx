import type { Metadata } from 'next';
import { getNomadById } from '@/data/nomads';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const num = parseInt(id, 10);
  const nomad = Number.isFinite(num) ? getNomadById(num) : undefined;
  if (!nomad) {
    return { title: 'Nomad Not Found | Nebula Nomads' };
  }
  const title = `${nomad.name} | Nebula Nomads`;
  const description =
    nomad.lore ||
    `${nomad.name} – ${nomad.rarity} Nomad. ${nomad.ability ? `Ability: ${nomad.ability}. ` : ''}Mint & collect.`;
  const url = `${siteUrl}/nomads/${nomad.id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        { url: `${siteUrl}/nfts/thumbs/nomad-${String(nomad.id).padStart(4, '0')}.png`, width: 512, height: 512, alt: nomad.name },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function NomadDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
