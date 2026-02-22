'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, XCircle } from 'lucide-react';
import {
  baseVpSourceValues,
  uprisingVpSourceValues,
  VpSource,
} from '@/db/schema';
import { cn, prettyLabel, resolveSourceImgPath } from '@/lib/utils';
import Image from 'next/image';
import { useGameType } from '@/components/dune-tracker/game-type-context';

interface VPSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSource: (source: VpSource) => void;
  pending: boolean;
  selectedSquare: number;
  currentSelection: { id: string; source: VpSource } | null;
  onDelete?: () => void;
}

export function VPSourceDialog({
  open,
  onOpenChange,
  onSelectSource,
  pending,
  selectedSquare,
  currentSelection,
  onDelete,
}: VPSourceDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { gameType } = useGameType();

  // Filter by search, then bubble currentSelection (if any) to the top
  const filteredSources = useMemo(() => {
    const vpSourcesByGameType =
      gameType === 'base' ? baseVpSourceValues : uprisingVpSourceValues;
    const q = searchQuery.toLowerCase();
    const list = vpSourcesByGameType.filter((s) => s.toLowerCase().includes(q));
    if (currentSelection) {
      const i = list.indexOf(currentSelection.source);
      if (i > 0) {
        list.splice(i, 1);
        list.unshift(currentSelection.source);
      }
    }
    return list;
  }, [searchQuery, currentSelection, gameType]);

  const handleSelect = (source: VpSource) => {
    if (pending) return;
    onSelectSource(source);
    setSearchQuery('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (pending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="h-[90vh] max-w-lg overflow-auto p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="text-xl md:text-lg">Select Source for </span>
                <span className="rounded-md border border-amber-300/40 bg-amber-100/10 px-2 py-0.5 text-xl font-semibold text-amber-800">
                  VP #{selectedSquare || '—'}
                </span>
              </span>
              {pending && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving…
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="border-b p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search VP sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'pl-9',
                  pending && 'cursor-not-allowed opacity-60',
                )}
                disabled={pending}
                aria-disabled={pending}
              />
            </div>
          </div>

          {currentSelection && (
            <div className="border-b bg-gradient-to-r from-amber-800/10 via-amber-700/20 to-amber-600/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-black/30">
                    <Image
                      src={resolveSourceImgPath(
                        gameType,
                        currentSelection.source,
                      )}
                      alt={prettyLabel(currentSelection.source)}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-black">
                      Current Selection
                    </div>
                    <div className="text-sm font-medium text-amber-800">
                      {prettyLabel(currentSelection.source)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onDelete}
                  disabled={pending}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-semibold',
                    'border-red-400/100 bg-red-500/10 text-red-600 hover:border-red-400/60 hover:bg-red-500/20',
                    'focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:ring-offset-2 focus:ring-offset-black',
                    pending && 'opacity-60',
                  )}
                  aria-label="Delete this VP"
                  title="Delete this VP"
                >
                  <XCircle className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="relative flex min-h-0 flex-1">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col gap-3 p-2">
                {filteredSources.map((source) => {
                  const isCurrent = currentSelection?.source === source;
                  return (
                    <button
                      key={source}
                      onClick={() => handleSelect(source)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-lg border-b-2 border-b-slate-700 p-3 text-left transition-colors',
                        'hover:bg-accent',
                        pending && 'opacity-60',
                        isCurrent && 'border-b-0 ring-1 ring-amber-600/70',
                      )}
                      disabled={pending}
                      aria-disabled={pending}
                    >
                      <div className="flex items-center gap-3">
                        <span className="relative inline-block h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-black/30">
                          <Image
                            src={resolveSourceImgPath(gameType, source)}
                            alt={prettyLabel(source)}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span className="font-medium">
                          {prettyLabel(source)}
                        </span>
                      </div>

                      {isCurrent && (
                        <span className="rounded-md border border-amber-600/90 bg-amber-200/10 px-2 py-0.5 text-xs font-semibold text-amber-900">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            {pending && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 shadow-sm">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Saving…</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
