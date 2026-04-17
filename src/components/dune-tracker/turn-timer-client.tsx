'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/dune-tracker/header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  COLOR_META,
  TimerColor,
  formatDuration,
} from '@/components/dune-tracker/turn-timer-config';

type TimerPhase = 'idle' | 'running' | 'paused' | 'ended';

interface TurnTimerClientProps {
  playerCount: 3 | 4;
  colors: TimerColor[];
  names: string[];
}

const CARD_THEME: Record<
  TimerColor,
  {
    base: string;
    active: string;
    positionText: string;
    timerText: string;
    endTurnBtn: string;
  }
> = {
  red: {
    base: 'border-red-500/35 bg-gradient-to-r from-red-950/40 via-red-900/30 to-black/30',
    active:
      'border-red-300/80 bg-gradient-to-r from-red-900/85 via-red-800/70 to-red-950/75 shadow-[0_0_0_1px_rgba(248,113,113,0.55),0_8px_28px_-12px_rgba(248,113,113,0.7)]',
    positionText: 'text-red-100/90',
    timerText: 'text-red-50',
    endTurnBtn: 'bg-red-500 text-white hover:bg-red-400',
  },
  green: {
    base: 'border-emerald-500/35 bg-gradient-to-r from-emerald-950/40 via-emerald-900/30 to-black/30',
    active:
      'border-emerald-300/80 bg-gradient-to-r from-emerald-900/85 via-emerald-800/70 to-emerald-950/75 shadow-[0_0_0_1px_rgba(110,231,183,0.55),0_8px_28px_-12px_rgba(16,185,129,0.7)]',
    positionText: 'text-emerald-100/90',
    timerText: 'text-emerald-50',
    endTurnBtn: 'bg-emerald-500 text-white hover:bg-emerald-400',
  },
  amber: {
    base: 'border-amber-500/35 bg-gradient-to-r from-amber-950/35 via-amber-900/30 to-black/30',
    active:
      'border-amber-300/80 bg-gradient-to-r from-amber-900/85 via-amber-800/70 to-amber-950/75 shadow-[0_0_0_1px_rgba(252,211,77,0.5),0_8px_28px_-12px_rgba(245,158,11,0.7)]',
    positionText: 'text-amber-100/90',
    timerText: 'text-amber-50',
    endTurnBtn: 'bg-amber-500 text-black hover:bg-amber-400',
  },
  blue: {
    base: 'border-sky-500/35 bg-gradient-to-r from-sky-950/40 via-sky-900/30 to-black/30',
    active:
      'border-sky-300/80 bg-gradient-to-r from-sky-900/85 via-sky-800/70 to-sky-950/75 shadow-[0_0_0_1px_rgba(125,211,252,0.55),0_8px_28px_-12px_rgba(14,165,233,0.7)]',
    positionText: 'text-sky-100/90',
    timerText: 'text-sky-50',
    endTurnBtn: 'bg-sky-500 text-white hover:bg-sky-400',
  },
};

export function TurnTimerClient({
  playerCount,
  colors,
  names,
}: TurnTimerClientProps) {
  const [durations, setDurations] = useState<number[]>(() =>
    Array.from({ length: playerCount }, () => 0),
  );
  const [round, setRound] = useState(1);
  const [startingIndex, setStartingIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentTurnSeconds, setCurrentTurnSeconds] = useState(0);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (phase !== 'running' || activeIndex === null) return;

    const intervalId = window.setInterval(() => {
      setDurations((previous) => {
        const next = [...previous];
        next[activeIndex] += 1;
        return next;
      });
      setCurrentTurnSeconds((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeIndex, phase]);

  useEffect(() => {
    const supportsWakeLock =
      typeof navigator !== 'undefined' && 'wakeLock' in navigator;
    if (!supportsWakeLock) return;

    const requestWakeLock = async () => {
      if (phase !== 'running') return;
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock((previous) => {
          if (previous && previous !== lock) {
            previous.release().catch(() => undefined);
          }
          return lock;
        });
      } catch {
        // Ignore wake lock failures and keep timer functional.
      }
    };

    const releaseWakeLock = async () => {
      setWakeLock((previous) => {
        if (previous) {
          previous.release().catch(() => undefined);
        }
        return null;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && phase === 'running') {
        void requestWakeLock();
      }
    };

    if (phase === 'running') {
      void requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    void releaseWakeLock();
    return;
  }, [phase]);

  useEffect(() => {
    return () => {
      wakeLock?.release().catch(() => undefined);
    };
  }, [wakeLock]);

  const nextStartingIndex = useMemo(
    () => (startingIndex + 1) % playerCount,
    [playerCount, startingIndex],
  );

  const handleStartOrResume = () => {
    if (phase === 'running') return;

    if (phase === 'idle') {
      setActiveIndex(startingIndex);
      setCurrentTurnSeconds(0);
      setPhase('running');
      return;
    }

    if (phase === 'paused') {
      setPhase('running');
      return;
    }

    if (phase === 'ended') {
      const newStarter = nextStartingIndex;
      setRound((previous) => previous + 1);
      setStartingIndex(newStarter);
      setActiveIndex(newStarter);
      setCurrentTurnSeconds(0);
      setPhase('running');
    }
  };

  const handlePause = () => {
    if (phase !== 'running') return;
    setPhase('paused');
  };

  const handleEndRound = () => {
    if (phase === 'idle' || phase === 'ended') return;
    setActiveIndex(null);
    setPhase('ended');
    setConfirmOpen(false);
  };

  const handleEndTurn = () => {
    if (phase !== 'running' || activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % playerCount);
    setCurrentTurnSeconds(0);
  };

  const primaryLabel =
    phase === 'ended'
      ? 'Start Next Round'
      : phase === 'idle'
        ? 'Start'
        : 'Resume';
  const displayNameAt = (slotIndex: number) =>
    names[slotIndex]?.trim() || COLOR_META[colors[slotIndex]].label;

  return (
    <div className="min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <section className="rounded-2xl border border-primary/20 bg-card/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-[family-name:var(--font-orbitron)] text-sm tracking-[0.15em] text-foreground">
              ROUND {round}
            </p>
            <p className="text-xs text-muted-foreground">
              First player: {displayNameAt(startingIndex)}
            </p>
          </div>
          {phase === 'ended' ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Next round starts with{' '}
              {displayNameAt(nextStartingIndex)}.
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              onClick={handleStartOrResume}
              disabled={phase === 'running'}
              className="h-11 bg-black font-[family-name:var(--font-orbitron)] text-xs tracking-[0.14em] text-white hover:bg-black/90"
            >
              {primaryLabel}
            </Button>
            <Button
              onClick={handlePause}
              disabled={phase !== 'running'}
              variant="outline"
              className="h-11 font-[family-name:var(--font-orbitron)] text-xs tracking-[0.14em]"
            >
              Pause
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={phase === 'idle' || phase === 'ended'}
              className="h-11 bg-red-600 font-[family-name:var(--font-orbitron)] text-xs tracking-[0.14em] text-white hover:bg-red-500 disabled:bg-red-950/40 disabled:text-red-100/70"
            >
              End Round
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          {colors.map((color, slotIndex) => {
            const meta = COLOR_META[color];
            const theme = CARD_THEME[color];
            const isCurrent = phase === 'running' && activeIndex === slotIndex;
            const isEndRoundState = phase === 'ended';
            const useActiveCardStyle = isCurrent || isEndRoundState;

            return (
              <div
                key={`${color}-${slotIndex}`}
                className={[
                  'rounded-xl border p-3 transition duration-300',
                  useActiveCardStyle ? theme.active : theme.base,
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-4 w-4 rounded-full ${meta.swatchClass}`}
                    />
                    <div>
                      <p className={`font-semibold ${meta.textClass}`}>
                        {displayNameAt(slotIndex)}
                      </p>
                      <p className={`text-xs ${theme.positionText}`}>
                        Position {slotIndex + 1}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isCurrent ? (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
                        Active
                      </p>
                    ) : null}
                    <p
                      className={[
                        'font-[family-name:var(--font-orbitron)] text-2xl tracking-[0.12em]',
                        theme.timerText,
                      ].join(' ')}
                    >
                      {isCurrent
                        ? formatDuration(currentTurnSeconds)
                        : formatDuration(durations[slotIndex] ?? 0)}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div className="text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                        Total Time
                      </p>
                      <p
                        className={[
                          'font-[family-name:var(--font-orbitron)] text-lg tracking-[0.08em]',
                          theme.timerText,
                        ].join(' ')}
                      >
                        {formatDuration(durations[slotIndex] ?? 0)}
                      </p>
                    </div>
                    <Button
                      onClick={handleEndTurn}
                      size="sm"
                      className={[
                        'font-[family-name:var(--font-orbitron)] text-xs tracking-[0.12em]',
                        theme.endTurnBtn,
                      ].join(' ')}
                    >
                      End Turn
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>
      </main>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md border-red-300/40 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-orbitron)] tracking-[0.08em] text-red-200">
              You sure mang?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-zinc-400/40 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleEndRound}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Confirm End Round
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
