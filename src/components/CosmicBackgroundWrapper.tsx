'use client';

import dynamic from 'next/dynamic';

const CosmicBackgroundR3F = dynamic(
  () => import('@/components/CosmicBackgroundR3F'),
  { ssr: false }
);

export default function CosmicBackgroundWrapper() {
  return <CosmicBackgroundR3F />;
}
