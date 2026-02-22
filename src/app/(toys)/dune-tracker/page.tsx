'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dune-tracker/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createGame } from '@/actions/duneTrackerAction';
import { GameType } from '@/db/schema';

const GAME_OPTIONS: Array<{
  value: GameType;
  label: string;
  sublabel: string;
}> = [
  {
    value: 'base' as GameType,
    label: 'BASE',
    sublabel: '+ Rise of Ix',
  },
  {
    value: 'uprising' as GameType,
    label: 'UPRISING',
    sublabel: '+ Bloodlines',
  },
];

export default function StartGamePage() {
  const router = useRouter();
  const placeholders = ['Ben', 'Calvin', 'Ethan', 'Kebin'];
  const [gameType, setGameType] = useState<GameType>('uprising');
  const [players, setPlayers] = useState({
    p1: '',
    p2: '',
    p3: '',
    p4: '',
  });

  const handlePlayerChange = (
    playerKey: keyof typeof players,
    value: string,
  ) => {
    setPlayers((prev) => ({
      ...prev,
      [playerKey]: value,
    }));
  };

  const handleStartGame = async () => {
    const { p1, p2, p3, p4 } = players;
    const safe = (v: string, fallback: string) => v.trim() || fallback;

    const gameId = await createGame(
      gameType,
      safe(p1, placeholders[0]),
      safe(p2, placeholders[1]),
      safe(p3, placeholders[2]),
      safe(p4, placeholders[3]),
    );
    router.push(`/dune-tracker/${gameId}`);
  };

  return (
    <div className="min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 flex-col justify-between p-6">
        <div className="flex flex-col gap-6">
          {/* NEW: Game type selector */}
          <section className="rounded-2xl border border-primary/20 bg-card/40 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <p className="font-[family-name:var(--font-orbitron)] text-xs tracking-[0.2em] text-muted-foreground">
                  GAME TYPE
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {GAME_OPTIONS.map((opt) => {
                const active = opt.value === gameType;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGameType(opt.value)}
                    className={[
                      'group relative rounded-xl border px-3 py-3 text-left transition',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      active
                        ? 'border-primary/60 bg-primary/10 shadow-sm'
                        : 'border-primary/20 bg-background/30 hover:border-primary/40 hover:bg-background/50',
                    ].join(' ')}
                  >
                    {/* subtle “glow” line */}
                    <div
                      className={[
                        'absolute inset-x-3 top-0 h-px rounded-full transition-opacity',
                        active
                          ? 'bg-primary/70 opacity-100'
                          : 'bg-primary/40 opacity-0 group-hover:opacity-60',
                      ].join(' ')}
                    />

                    <div className="flex flex-col gap-1">
                      <span
                        className={[
                          'font-[family-name:var(--font-orbitron)] text-sm tracking-wider',
                          active ? 'text-foreground' : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {opt.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {opt.sublabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <h2 className="text-center font-[family-name:var(--font-orbitron)] text-xl font-semibold tracking-wider text-foreground">
            ENTER PLAYER NAMES
          </h2>

          <div className="flex flex-col gap-4">
            {(['p1', 'p2', 'p3', 'p4'] as const).map((playerKey, index) => (
              <div key={playerKey} className="flex flex-col gap-2">
                <Label
                  htmlFor={playerKey}
                  className="font-[family-name:var(--font-orbitron)] text-sm tracking-wider text-muted-foreground"
                >
                  PLAYER {index + 1}
                </Label>
                <Input
                  id={playerKey}
                  value={players[playerKey]}
                  onChange={(e) =>
                    handlePlayerChange(playerKey, e.target.value)
                  }
                  className="h-14 border-2 border-primary/30 bg-card/50 text-lg font-medium text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary"
                  placeholder={`${placeholders[index]}`}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleStartGame}
          className="mt-8 h-14 w-full bg-black font-[family-name:var(--font-orbitron)] text-lg tracking-wider text-white hover:bg-black/90"
        >
          START GAME
        </Button>
      </main>
    </div>
  );
}
