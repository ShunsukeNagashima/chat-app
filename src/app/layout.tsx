'use client';

import { Inter } from 'next/font/google';

import { Head } from './head';

import { Toast } from '@/components/ui/toast';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <Head />
      <body className={inter.className}>
        {children}
        <div>
          <Toast />
        </div>
      </body>
    </html>
  );
}
