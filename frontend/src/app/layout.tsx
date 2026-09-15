import { Header } from '@/components/header';
import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'enrollee-2026',
  description: 'Сервис для повышения комфорта поступления в вузы России',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <Providers>
        <body className="flex min-h-full flex-col">
          <Header />
          {children}
        </body>
      </Providers>
    </html>
  );
}
