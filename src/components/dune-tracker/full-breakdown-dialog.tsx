'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { cn, prettyLabel, resolveSourceImgPath } from '@/lib/utils';
import type { PlayerVpData } from '@/actions/duneTrackerAction';
import { useGameType } from '@/components/dune-tracker/game-type-context';

interface FullBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  playerVPs: PlayerVpData;
}

export function FullBreakdownDialog({
  open,
  onOpenChange,
  playerName,
  playerVPs,
}: FullBreakdownDialogProps) {
  const { gameType } = useGameType();
  const lastRound =
    playerVPs.vps.length > 0
      ? Math.max(...playerVPs.vps.map((v) => v.round))
      : 0;

  const rounds = Array.from(
    { length: Math.max(lastRound, 1) },
    (_, i) => i + 1,
  );

  const vpsByRound = new Map<number, typeof playerVPs.vps>();
  for (const r of rounds) vpsByRound.set(r, []);
  for (const vp of playerVPs.vps) {
    const list = vpsByRound.get(vp.round);
    if (list) list.push(vp);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-full overflow-hidden p-0',
          'border border-amber-300/20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900',
        )}
      >
        <DialogHeader className="border-b border-amber-300/10 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-amber-900/20 px-5 py-4 md:pt-14">
          <DialogTitle className="mx-4 flex items-center justify-around gap-4 text-amber-200">
            <span className="text-xl font-semibold tracking-wide md:text-xl">
              Full Breakdown — {playerName}
            </span>
            <span className="rounded-md border border-amber-200/20 bg-amber-100/5 px-2 py-0.5 text-xl text-amber-200 md:text-lg">
              {playerVPs.vps.length} VP
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-2 px-4 py-4">
            {rounds.map((round) => {
              const items = vpsByRound.get(round) ?? [];
              const hasVP = items.length > 0;

              return (
                <div
                  key={round}
                  className={cn(
                    'rounded-lg border px-4 py-3',
                    'bg-gradient-to-r',
                    hasVP
                      ? 'border-amber-300/20 from-amber-800/15 via-amber-700/10 to-amber-600/10'
                      : 'border-white/10 from-neutral-800/30 via-neutral-800/20 to-neutral-800/10',
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex h-8 w-8 items-center justify-center rounded-md border text-base font-bold',
                          hasVP
                            ? 'border-green-400/40 bg-amber-200/10 text-green-200'
                            : 'border-white/15 bg-white/5 text-neutral-200',
                        )}
                      >
                        R{round}
                      </span>
                      <span
                        className={cn(
                          'text-lg font-medium tracking-wide md:text-lg',
                          hasVP ? 'text-amber-200' : 'text-neutral-300',
                        )}
                      >
                        {hasVP
                          ? 'Victory Points gained ->'
                          : 'No VP this round'}
                      </span>
                    </div>

                    {hasVP && (
                      <span className="text-xl text-amber-200/80">
                        +{items.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hasVP
                      ? items.map((vp) => (
                          <div
                            key={vp.id}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/5 px-3 py-1.5"
                            title={prettyLabel(vp.source)}
                          >
                            <span className="relative inline-block h-8 w-8 overflow-auto rounded-full border border-white/10 bg-black/30">
                              <Image
                                src={resolveSourceImgPath(gameType, vp.source)}
                                alt={prettyLabel(vp.source)}
                                width={36}
                                height={36}
                                className="h-full w-full object-contain"
                              />
                            </span>
                            <span className="text-lg font-medium text-amber-100 md:text-lg">
                              {prettyLabel(vp.source)}
                            </span>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
