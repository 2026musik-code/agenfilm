import BottomNav from '@/components/BottomNav';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LUXEDRAMA | Premium Asian Drama Streaming',
  description: 'Experience the best Asian dramas in luxury style. Watch HD dramas, movies, and series with premium quality.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like behavior
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-luxury-black text-white antialiased pb-16 md:pb-0`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
