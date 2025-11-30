'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { cn, prettyLabel, resolveSourceImgPath } from '@/lib/utils';
import type { PlayerVpData } from '@/actions/duneTrackerAction';
import type { VpSource } from '@/db/schema';

interface VPGridProps {
  playerVPs: PlayerVpData;
  currentRound: number;
  onSquareClick: (squareNumber: number) => void;
}

function squareTheme(n: number) {
  const base =
    'bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-800 ' +
    'border-neutral-700 shadow-sm';

  const highlight =
    'bg-gradient-to-b from-amber-600/25 via-amber-500/15 to-amber-400/10 ' +
    'border-amber-500/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]';

  const number =
    n >= 10
      ? 'text-amber-300 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]'
      : 'text-neutral-200 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]';

  return {
    tile: cn(
      'relative aspect-square rounded-xl border-2 transition-all',
      base,
      n >= 10 && highlight,
      'hover:border-primary/70 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2',
    ),
    number,
  };
}

export function VPGrid({
  playerVPs,
  currentRound,
  onSquareClick,
}: VPGridProps) {
  const filledSources = useMemo(
    () => playerVPs.vps.filter((vp) => vp.round <= currentRound),
    [playerVPs.vps, currentRound],
  );

  const squares = useMemo(
    () => Array.from({ length: 15 }, (_, i) => i + 1),
    [],
  );

  const sourceBySquareIndex = useMemo(() => {
    const map = new Map<number, VpSource>();
    for (let i = 0; i < Math.min(filledSources.length, squares.length); i++) {
      map.set(i + 1, filledSources[i].source as VpSource);
    }
    return map;
  }, [filledSources, squares.length]);

  const nextSquareIndex = Math.min(filledSources.length + 1, 15);
  const canAdd = filledSources.length < 15;

  return (
    <div className="flex-1">
      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {/* 1..15 tiles */}
        {squares.map((squareNumber) => {
          const source = sourceBySquareIndex.get(squareNumber);
          const isFilled = !!source;
          const { tile, number } = squareTheme(squareNumber);

          return (
            <button
              key={squareNumber}
              onClick={() => onSquareClick(squareNumber)}
              aria-label={
                isFilled
                  ? `VP ${squareNumber}: ${prettyLabel(source!)}`
                  : `VP ${squareNumber}: Empty`
              }
              className={tile}
            >
              <div className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute inset-2">
                <div className="absolute left-0 top-0 h-1 w-1 rounded-full bg-white/25" />
                <div className="absolute right-0 top-0 h-1 w-1 rounded-full bg-white/25" />
                <div className="absolute bottom-0 left-0 h-1 w-1 rounded-full bg-white/25" />
                <div className="absolute bottom-0 right-0 h-1 w-1 rounded-full bg-white/25" />
              </div>

              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center font-extrabold',
                  'text-2xl sm:text-3xl md:text-4xl',
                  number,
                )}
              >
                {squareNumber}
              </span>

              {isFilled && (
                <div className="pointer-events-none absolute inset-1 flex items-center justify-center p-2">
                  <div className="relative h-full max-h-[160px] w-full max-w-[160px] drop-shadow-lg">
                    <Image
                      src={resolveSourceImgPath(source!)}
                      alt={prettyLabel(source!)}
                      fill
                      className="rounded-full object-contain opacity-95"
                      sizes="84px"
                      priority={squareNumber <= 3}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => canAdd && onSquareClick(nextSquareIndex)}
          aria-label="Add victory point"
          className={cn(
            'relative aspect-square rounded-xl border-2 transition-all',
            'bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.25),rgba(2,6,23,0.8))] from-purple-700/30 to-slate-950',
            'border-violet-400/40 hover:border-amber-300/60',
            'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_25px_-10px_rgba(147,51,234,0.5)]',
            'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_35px_-10px_rgba(251,191,36,0.5)]',
            'focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:ring-offset-2 focus:ring-offset-black',
            !canAdd && 'cursor-not-allowed opacity-50',
          )}
          disabled={!canAdd}
        >
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute inset-0 animate-pulse rounded-xl bg-[radial-gradient(60%_60%_at_50%_40%,rgba(251,191,36,0.08),transparent)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-amber-300/40 bg-amber-100/10 shadow-inner shadow-black/40">
              <Plus className="h-7 w-7 text-amber-200 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]" />
            </span>
          </div>

          <span className="pointer-events-none absolute left-2 top-2 h-1 w-1 rounded-full bg-white/70 blur-[0.3px]" />
          <span className="pointer-events-none absolute right-4 top-5 h-[2px] w-[2px] rounded-full bg-white/60 blur-[0.3px]" />
          <span className="pointer-events-none absolute bottom-6 left-5 h-[2px] w-[2px] rounded-full bg-white/50 blur-[0.3px]" />
        </button>
      </div>
    </div>
  );
}
