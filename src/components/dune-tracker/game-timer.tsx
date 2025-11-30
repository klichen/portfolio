'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

const TURN_DURATION_MS = 90_000;

function formatGameTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function formatTurnTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(1, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function GameTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [gameElapsedMs, setGameElapsedMs] = useState(0);
  const [turnRemainingMs, setTurnRemainingMs] = useState(TURN_DURATION_MS);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGameElapsedMs((prev) => prev + 1000);
      setTurnRemainingMs((prev) => Math.max(prev - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // each resume starts a fresh 90s turn countdown
  const handleResume = () => {
    setTurnRemainingMs(TURN_DURATION_MS);
    setIsRunning(true);
  };

  const handleStop = () => {
    // stop everything & reset the per-turn timer
    setIsRunning(false);
    setTurnRemainingMs(TURN_DURATION_MS);
  };

  const turnOver = turnRemainingMs === 0;

  return (
    <section className="mt-2 rounded-2xl border border-white/10 bg-card/80 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_40px_-18px_rgba(0,0,0,0.8)]">
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Turn Timer
            </span>
            <div
              className={[
                'font-[family-name:var(--font-orbitron)] text-3xl font-semibold',
                turnOver ? 'text-red-400' : 'text-amber-600',
              ].join(' ')}
            >
              {formatTurnTime(turnRemainingMs)}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Total Time
            </span>
            <div className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold text-amber-300 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
              {formatGameTime(gameElapsedMs)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="noHover"
            onClick={handleResume}
            disabled={isRunning}
            className="flex-1 justify-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-r from-indigo-900 via-purple-900 to-amber-800 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_10px_24px_-12px_rgba(0,0,0,0.9)]"
          >
            <Play className="h-3 w-3" />
            {gameElapsedMs === 0 ? <p>Start</p> : <p>Resume</p>}
          </Button>

          <Button
            type="button"
            variant="noHover"
            onClick={handleStop}
            disabled={!isRunning}
            className="flex-1 justify-center gap-2 rounded-xl border border-white/15 bg-black/80 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            <Square className="h-3 w-3" />
            Stop
          </Button>
        </div>
      </div>
    </section>
  );
}
