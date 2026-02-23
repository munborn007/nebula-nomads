import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import 'react-vertical-timeline-component/style.min.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CosmicEcho from '@/components/CosmicEcho';
import WormholeTransition from '@/components/WormholeTransition';
import ExtensionErrorShield from '@/components/ExtensionErrorShield';
import Script from 'next/script';

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nebula-nomads-ci2j.vercel.app';

export const metadata: Metadata = {
  title: 'Nebula Nomads - AI Cosmic NFTs with AR',
  description:
    'AI-powered cosmic NFT collection. Mint, collect, and view Nebula Nomads in AR. NFT drop Q2 2026.',
  keywords: ['NFT', 'AR', 'xAI', 'cosmic', 'Nebula Nomads', 'AI NFT', 'space NFT', 'mint 2026'],
  openGraph: {
    title: 'Nebula Nomads – AI Cosmic NFTs with AR',
    description: 'Mint, collect, and explore the cosmos. AI-curated space explorers. Mint Q2 2026.',
    type: 'website',
    url: siteUrl,
    images: [{ url: `${siteUrl}/hero.png`, width: 1200, height: 630, alt: 'Nebula Nomads' }],
  },
  twitter: { card: 'summary_large_image', title: 'Nebula Nomads - AI Cosmic NFTs with AR' },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} font-sans antialiased`}>
        {/* Load error suppression script BEFORE Next.js initializes */}
        <Script id="early-error-suppression" strategy="beforeInteractive" src="/suppress-extension-errors.js" />
        <ExtensionErrorShield />
        <CosmicEcho>
          <WormholeTransition>
            <Header />
            <main className="relative z-10 min-h-screen pt-16">{children}</main>
            <Footer />
          </WormholeTransition>
        </CosmicEcho>
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="lazyOnload"
        />
        {/* Suppress wallet extension errors so they don't trigger Next.js error overlay */}
        <Script id="suppress-extension-errors" strategy="beforeInteractive">
          {`
            (function() {
              function isExtensionError(msg, stack) {
                var s = (stack || '') + (msg || '');
                return /chrome-extension:\\/\\//.test(s) ||
                  /evmAsk\\.js/.test(s) ||
                  /Extension context invalidated/.test(s) ||
                  /Unexpected error/.test(s) ||
                  (/evmAsk|extension|selectExtension|wallet/.test(s) && /request|connect/.test(s));
              }
              var origError = console.error;
              console.error = function() {
                var msg = Array.prototype.join.call(arguments, ' ');
                var stack = (arguments[0] && arguments[0].stack) || '';
                if (isExtensionError(msg, stack) || (msg === 'Unexpected error' && stack.indexOf('evmAsk') !== -1)) return;
                origError.apply(console, arguments);
              };
              window.addEventListener('unhandledrejection', function(event) {
                var r = event.reason;
                var msg = r?.message || r?.toString?.() || '';
                var stack = r?.stack || '';
                if (isExtensionError(msg, stack)) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  return false;
                }
              }, true);
              window.onerror = function(msg, url, line, col, err) {
                var stack = (err && err.stack) || '';
                if (isExtensionError(msg, stack)) return true;
                return false;
              };
            })();
          `}
        </Script>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        )}
        <Analytics />
      </body>
    </html>
  );
}
