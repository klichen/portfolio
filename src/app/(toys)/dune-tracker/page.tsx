'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dune-tracker/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createGame } from '@/actions/duneTrackerAction';

export default function StartGamePage() {
  const router = useRouter();
  const placeholders = ['Ben', 'Calvin', 'Ethan', 'Kebin'];
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
