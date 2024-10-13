import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { cn } from '@/lib/utils';

import './globals.css';
import Providers from '@/app/providers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Kevin's Portfolio ",
  description: 'Portfolio website for klichen',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          inter.variable,
          playfair.variable,
        )}
      >
        <Providers>
          <Header />
          <main className="grow">{children}</main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
