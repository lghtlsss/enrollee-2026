import { Header } from '@/components/header';
import { Providers } from '@/components/providers/providers';
import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'UniVibe — подбор вуза по баллам ЕГЭ',
  description:
    'Введите баллы ЕГЭ и предпочтения — UniVibe покажет вузы, оценит шансы поступления и расскажет, какой там вайб по отзывам студентов.',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c9d3f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
