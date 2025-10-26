'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface HeaderProps {
  gameDate?: Date;
}

export function Header({ gameDate }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = gameDate
    ? gameDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      console.error('failed to copy');
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <header className="relative overflow-auto border-b border-primary/30">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{
          backgroundImage: 'url(/images/dune-tracker/di_background.jpg)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

      <div className="relative z-10 px-4 py-4 sm:py-6">
        <div className="flex flex-row items-center justify-between gap-2">
          <Link
            href="/dune-tracker"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 p-2 py-1.5 text-white/90 shadow-sm backdrop-blur-sm transition hover:border-amber-300/40 hover:bg-black/55"
            aria-label="Go to Home"
          >
            <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/30">
              <Image
                src="/images/dune-tracker/home-icon.png"
                alt="Home"
                fill
                sizes="48px"
                className="object-contain"
              />
            </span>
            <span className="hidden text-sm font-medium tracking-wide md:inline">
              Home
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <h1 className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-[0.25em] text-white sm:text-xl sm:tracking-[0.3em]">
              DUNE IMPERIUM VP TRACKER
            </h1>
            {formattedDate ? (
              <time className="text-xs tracking-wider text-white/70 sm:text-base">
                {formattedDate}
              </time>
            ) : (
              <span className="text-xs tracking-wider text-white/70 sm:text-base">
                Rise of Ix
              </span>
            )}
          </div>

          <button
            onClick={share}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 p-2 text-white/90 shadow-sm backdrop-blur-sm transition hover:border-amber-300/40 hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Share link"
          >
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              {copied ? (
                <Check className="h-5 w-5 text-amber-300" />
              ) : (
                <Share2 className="h-5 w-5 text-amber-200" />
              )}
            </span>
            <span className="hidden text-sm font-semibold tracking-wide sm:inline">
              {copied ? 'Copied!' : 'Share'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
