import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Aditi Library - Modern Library Management System',
  description:
    'Comprehensive library management system for students and staff with premium UI/UX design.',
  keywords: ['library', 'management', 'students', 'education', 'Next.js'],
  authors: [{ name: 'Aditi Library Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Aditi Library - Modern Library Management System',
    description: 'Comprehensive library management system for students and staff',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
