// app/layout.tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HustleIQ — Time-Based Income Optimization',
  description: 'Stop wasting time on low-value side hustles. HustleIQ scores every hustle by income efficiency, opportunity cost, and skill growth.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`}>
      <body className="font-sans antialiased bg-[#F0F6FF] min-h-screen">
        {children}
      </body>
    </html>
  );
}
