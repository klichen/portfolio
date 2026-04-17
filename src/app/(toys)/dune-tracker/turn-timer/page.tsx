'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dune-tracker/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  COLOR_META,
  TIMER_COLORS,
  TimerColor,
} from '@/components/dune-tracker/turn-timer-config';

export default function TurnTimerSetupPage() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<3 | 4>(4);
  const [selectedColors, setSelectedColors] = useState<
    Array<TimerColor | null>
  >([null, null, null, null]);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);

  const activeSlots = selectedColors.slice(0, playerCount);
  const canStart = activeSlots.every(
    (color): color is TimerColor => color !== null,
  );

  const onColorSelect = (slotIndex: number, color: TimerColor) => {
    setSelectedColors((prev) => {
      const next = [...prev];
      next[slotIndex] = next[slotIndex] === color ? null : color;
      return next;
    });
  };

  const clearColor = (slotIndex: number) => {
    setSelectedColors((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const startTimer = () => {
    if (!canStart) return;

    const colors = activeSlots.join(',');
    const names = playerNames.slice(0, playerCount).map((name) => name.trim());
    const params = new URLSearchParams();
    params.set('colors', colors);
    params.set('names', JSON.stringify(names));

    router.push(
      `/dune-tracker/turn-timer/${playerCount}p?${params.toString()}`,
    );
  };

  return (
    <div className="min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6">
        <section className="rounded-2xl border border-primary/20 bg-card/40 p-4 shadow-sm">
          <p className="font-[family-name:var(--font-orbitron)] text-xs tracking-[0.2em] text-muted-foreground">
            TURN TIMER SETUP
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[3, 4].map((count) => {
              const active = playerCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count as 3 | 4)}
                  className={[
                    'rounded-xl border px-3 py-3 text-left transition',
                    active
                      ? 'border-primary/60 bg-primary/10 shadow-sm'
                      : 'border-primary/20 bg-background/30 hover:border-primary/40 hover:bg-background/50',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'font-[family-name:var(--font-orbitron)] text-sm tracking-wider',
                      active ? 'text-foreground' : 'text-muted-foreground',
                    ].join(' ')}
                  >
                    {count} PLAYER
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-card/30 p-4">
          <div className="space-y-4">
            {activeSlots.map((currentColor, slotIndex) => {
              const usedByOthers = new Set<TimerColor>(
                activeSlots.filter(
                  (slotColor, idx): slotColor is TimerColor =>
                    idx !== slotIndex && slotColor !== null,
                ),
              );
              const choices = TIMER_COLORS.filter(
                (color) => !usedByOthers.has(color) && color !== currentColor,
              );
              const currentMeta = currentColor
                ? COLOR_META[currentColor]
                : null;

              return (
                <div
                  key={`slot-${slotIndex + 1}`}
                  className="rounded-xl border border-primary/20 bg-background/30 p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="font-[family-name:var(--font-orbitron)] text-xs tracking-[0.18em] text-muted-foreground">
                      POSITION {slotIndex + 1}
                    </p>
                    {currentMeta ? (
                      <button
                        type="button"
                        onClick={() => clearColor(slotIndex)}
                        className={[
                          'inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition',
                          `${currentMeta.borderClass} bg-white/10 text-foreground hover:bg-white/20`,
                        ].join(' ')}
                        aria-label={`Clear ${currentMeta.label} from position ${slotIndex + 1}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${currentMeta.swatchClass}`}
                        />
                        {currentMeta.label}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Pick a color
                      </span>
                    )}
                  </div>

                  {!currentColor && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {choices.map((color) => {
                        const meta = COLOR_META[color];

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => onColorSelect(slotIndex, color)}
                            className={[
                              'inline-flex items-center gap-2 rounded-lg border px-2 py-2 text-sm transition',
                              'border-primary/20 bg-black/20 text-muted-foreground',
                              'hover:border-primary/50 hover:bg-black/30',
                            ].join(' ')}
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${meta.swatchClass}`}
                            />
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentColor && (
                    <div className="mt-3">
                      <Input
                        value={playerNames[slotIndex]}
                        onChange={(e) => {
                          const next = [...playerNames];
                          next[slotIndex] = e.target.value;
                          setPlayerNames(next);
                        }}
                        placeholder={`Player ${slotIndex + 1} name`}
                        className="h-10 border-primary/30 bg-gray-100 text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Button
          onClick={startTimer}
          disabled={!canStart}
          className="h-12 bg-black font-[family-name:var(--font-orbitron)] tracking-[0.14em] text-white hover:bg-black/90"
        >
          START TURN TIMER
        </Button>
      </main>
    </div>
  );
}
