import './globals.css';

import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { Toaster } from '@/components/ui/sonner';
import UserBar from '@/components/user-bar/UserBar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import MobileBar from '@/components/user-bar/MobileBar';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Karaoke Match',
  description: 'Match songs with your karaoke friends',
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
          <UserBar />
          <main>{children}</main>
          <Suspense fallback={null}>
            <MobileBar />
          </Suspense>
          <Toaster />
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
