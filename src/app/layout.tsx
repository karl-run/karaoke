import './globals.css';

import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import UserBar from '@/components/rsc/UserBar';

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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <UserBar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
