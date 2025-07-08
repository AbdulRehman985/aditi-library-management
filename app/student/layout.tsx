'use client';

import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} min-h-screen bg-gray-50 font-sans antialiased`}>
      {children}
      <Toaster position="top-center" />
    </div>
  );
}
