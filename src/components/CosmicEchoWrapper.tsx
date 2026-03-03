'use client';

import dynamic from 'next/dynamic';

/** Client-only wrapper so we can use ssr: false; avoids "ssr: false not allowed in Server Components". */
const CosmicEcho = dynamic(() => import('@/components/CosmicEcho'), {
  ssr: false,
  loading: () => null,
});

export default function CosmicEchoWrapper({ children }: { children: React.ReactNode }) {
  return <CosmicEcho>{children}</CosmicEcho>;
}
