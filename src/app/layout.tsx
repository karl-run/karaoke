import './globals.css';

import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { Toaster } from '@/components/ui/sonner';
import UserBar from '@/components/user-bar/UserBar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import MobileBar from '@/components/user-bar/MobileBar';

import Footer from './_footer';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Karaoke Match - What songs do you and your friends Love?',
  description:
    'Karaoke Match lets you build your a track of your absolute favorite karaoke songs (bangers), invite your friends to a group and see what songs two or more of you love!',
  openGraph: {
    images: [
      {
        url: 'https://karaoke.karl.run/api/og',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-svh">
            <UserBar />
            <main>{children}</main>
            <Suspense fallback={null}>
              <MobileBar />
            </Suspense>
            <Toaster />
          </div>
          <Footer />
        </ThemeProvider>
      </body>
      <Script
        strategy="afterInteractive"
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "b5b39f9a6c334feebd09ae642c9a9f1e"}'
      />
    </html>
  );
}
