'use client';

import { useMemo, useState, useTransition } from 'react';
import { VPGrid } from './vp-grid';
import { VPSourceDialog } from './vp-source-dialog';
import { PlayerSelect } from './player-select';
import { RoundNavigator } from './round-navigator';
import { Header } from './header';
import {
  addHighCouncilAcquired,
  addSwordmasterAcquired,
  addVictoryPoint,
  editVictoryPoint,
  getVpIdFromSource,
  removeHighCouncilAcquired,
  removeSwordmasterAcquired,
  removeVictoryPoint,
} from '@/actions/duneTrackerAction';
import type { GameData } from '@/actions/duneTrackerAction';
import { GameType, VpSource } from '@/db/schema';
import { FullBreakdownDialog } from '@/components/dune-tracker/full-breakdown-dialog';
import { GameTimer } from '@/components/dune-tracker/game-timer';
import { GameTypeProvider } from '@/components/dune-tracker/game-type-context';
import { LandsraadTracker } from '@/components/dune-tracker/landsraad-tracker';

export function GameTrackerClient({ initialGame }: { initialGame: GameData }) {
  const [selectedPlayer, setSelectedPlayer] = useState(initialGame.p1Name);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const gameType = initialGame.type as GameType;
  const players = [
    initialGame.p1Name,
    initialGame.p2Name,
    initialGame.p3Name,
    initialGame.p4Name,
  ];
  const gameId = initialGame.id;
  const currentPlayerData = initialGame.byPlayer[selectedPlayer];

  const currentPlayerSorted = useMemo(() => {
    return [...currentPlayerData.vps].sort((a, b) => {
      if (a.round !== b.round) return a.round - b.round;
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
  }, [currentPlayerData.vps]);

  const filledForRound = useMemo(
    () => currentPlayerSorted.filter((vp) => vp.round <= currentRound),
    [currentPlayerSorted, currentRound],
  );

  const vpBySquareIndex = useMemo(() => {
    const map = new Map<number, (typeof currentPlayerSorted)[number]>();
    for (let i = 0; i < Math.min(filledForRound.length, 15); i++) {
      map.set(i + 1, filledForRound[i]);
    }
    return map;
  }, [filledForRound]);

  const handleSquareClick = (squareNumber: number) =>
    setSelectedSquare(squareNumber);

  const handleVPSourceSelect = (source: VpSource) => {
    if (selectedSquare === null) return;

    const existing = vpBySquareIndex.get(selectedSquare) || null;

    startTransition(async () => {
      try {
        if (existing) {
          if (existing.source !== source) {
            await editVictoryPoint(existing.id, source);
          }
        } else {
          // check if it's an alliance -> remove any existing alliance before adding
          if (source.includes('alliance')) {
            const vpId = await getVpIdFromSource(gameId, source);
            if (vpId) {
              await removeVictoryPoint(vpId);
            }
          }

          await addVictoryPoint(gameId, selectedPlayer, source, currentRound);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSelectedSquare(null);
      }
    });
  };

  const handleDelete = () => {
    if (selectedSquare === null) return;
    const existing = vpBySquareIndex.get(selectedSquare);
    if (!existing) return;

    startTransition(async () => {
      try {
        await removeVictoryPoint(existing.id);
      } catch (e) {
        console.error(e);
      } finally {
        setSelectedSquare(null);
      }
    });
  };

  const handlePreviousRound = () => setCurrentRound((r) => Math.max(1, r - 1));
  const handleNextRound = () => setCurrentRound((r) => Math.min(10, r + 1));

  const handleHighCouncilToggle = () => {
    startTransition(async () => {
      try {
        if (currentPlayerData.highCouncil) {
          await removeHighCouncilAcquired(currentPlayerData.highCouncil.id);
          return;
        }

        await addHighCouncilAcquired(gameId, selectedPlayer, currentRound);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleSwordmasterToggle = (cost: 6 | 8) => {
    startTransition(async () => {
      try {
        const existing = currentPlayerData.swordmaster;
        if (existing?.cost === cost) {
          await removeSwordmasterAcquired(existing.id);
          return;
        }

        if (existing) {
          await removeSwordmasterAcquired(existing.id);
        }

        await addSwordmasterAcquired(
          gameId,
          selectedPlayer,
          currentRound,
          cost,
        );
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <GameTypeProvider initialGameType={gameType}>
      <div className="flex flex-col overflow-y-auto bg-background md:max-h-screen">
        <Header gameDate={initialGame.timestamp} />

        <main className="flex flex-1 flex-col justify-between gap-2 p-4">
          <div className="mb-2 flex items-center justify-between gap-4">
            <PlayerSelect
              players={players}
              selectedPlayer={selectedPlayer}
              onPlayerChange={setSelectedPlayer}
            />
            <div className="rounded-lg border-2 border-primary bg-card px-4 py-0">
              <span className="text-xl font-bold text-muted-foreground">
                ROUND
              </span>
              <span className="ml-2 font-[family-name:var(--font-orbitron)] text-4xl font-bold text-amber-800 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                {currentRound}
              </span>
            </div>
          </div>

          <VPGrid
            playerVPs={currentPlayerData}
            onSquareClick={handleSquareClick}
            currentRound={currentRound}
          />

          <RoundNavigator
            currentRound={currentRound}
            onPrevious={handlePreviousRound}
            onNext={handleNextRound}
          />

          <div className="mt-2 flex justify-center">
            <button
              onClick={() => setShowBreakdown(true)}
              className={[
                // shape + layout
                'group relative inline-flex w-full items-center justify-center gap-3 rounded-xl px-5 py-2',
                // dune-y space gradient & subtle glow
                'bg-gradient-to-r from-indigo-900 via-purple-900 to-amber-800',
                'shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(0,0,0,0.6)]',
                // borders + hover
                'border border-white/10 hover:border-amber-300/40',
                // text
                'font-[family-name:var(--font-orbitron)] font-semibold tracking-wide text-amber-200',
                // focus
                'focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-black',
                'overflow-hidden',
              ].join(' ')}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10">SHOW FULL BREAKDOWN</span>
              <span className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 text-xs font-bold text-amber-300">
                ◎
              </span>
            </button>
          </div>

          <GameTimer />

          <LandsraadTracker
            highCouncil={currentPlayerData.highCouncil}
            swordmaster={currentPlayerData.swordmaster}
            pending={isPending}
            onToggleHighCouncil={handleHighCouncilToggle}
            onToggleSwordmaster={handleSwordmasterToggle}
          />
        </main>

        <VPSourceDialog
          open={selectedSquare !== null}
          onOpenChange={(open) => !open && setSelectedSquare(null)}
          onSelectSource={handleVPSourceSelect}
          selectedSquare={selectedSquare ?? 0}
          currentSelection={
            selectedSquare
              ? (vpBySquareIndex.get(selectedSquare) ?? null)
              : null
          }
          onDelete={handleDelete}
          pending={isPending}
        />

        <FullBreakdownDialog
          open={showBreakdown}
          onOpenChange={setShowBreakdown}
          playerName={selectedPlayer}
          playerVPs={currentPlayerData}
        />
      </div>
    </GameTypeProvider>
  );
}
