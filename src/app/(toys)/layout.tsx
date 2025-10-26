import type { Metadata } from 'next';
import '../globals.css';
import { Orbitron } from 'next/font/google';

const _orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'DI - Tracker',
  description: 'VP Source and Round tracker for DI: Rise of Ix',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}
