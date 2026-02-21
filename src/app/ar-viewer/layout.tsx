import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Nomad Viewer | Nebula Nomads NFT',
  description: 'View your Nebula Nomad in AR. Marker-free WebAR on mobile, 3D on desktop.',
};

export const dynamic = 'force-dynamic';

export default function ARViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
