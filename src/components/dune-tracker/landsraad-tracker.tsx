'use client';

import Image from 'next/image';
import type { PlayerVpData } from '@/actions/duneTrackerAction';

interface LandsraadTrackerProps {
  highCouncil: PlayerVpData['highCouncil'];
  swordmaster: PlayerVpData['swordmaster'];
  pending: boolean;
  onToggleHighCouncil: () => void;
  onToggleSwordmaster: (cost: 6 | 8) => void;
}

export function LandsraadTracker({
  highCouncil,
  swordmaster,
  pending,
  onToggleHighCouncil,
  onToggleSwordmaster,
}: LandsraadTrackerProps) {
  const highCouncilAcquired = !!highCouncil;
  const swordmaster6Acquired = swordmaster?.cost === 6;
  const swordmaster8Acquired = swordmaster?.cost === 8;

  return (
    <section className="mt-2 rounded-2xl border border-white/10 bg-card/80 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_40px_-18px_rgba(0,0,0,0.8)]">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Landsraad Bonuses
      </p>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onToggleHighCouncil}
          disabled={pending}
          aria-label="Toggle High Council"
          className={[
            'group relative overflow-hidden rounded-xl border transition-all',
            highCouncilAcquired
              ? 'border-amber-300/40 bg-amber-100/10'
              : 'border-white/15 bg-black/30',
            'focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:ring-offset-2 focus:ring-offset-black',
            pending && 'cursor-not-allowed',
          ].join(' ')}
        >
          <Image
            src="/images/dune-tracker/high_council.png"
            alt="High Council"
            width={256}
            height={256}
            className={[
              'h-auto w-full object-contain transition-opacity duration-200',
              highCouncilAcquired
                ? 'opacity-100'
                : 'opacity-40 group-hover:opacity-65',
              pending && 'opacity-35',
            ].join(' ')}
          />
          {highCouncil && (
            <span className="absolute bottom-2 right-2 rounded-md border border-amber-200/30 bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
              R{highCouncil.round}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleSwordmaster(8)}
          disabled={pending}
          aria-label="Toggle Swordmaster cost 8"
          className={[
            'group relative overflow-hidden rounded-xl border transition-all',
            swordmaster8Acquired
              ? 'border-amber-300/40 bg-amber-100/10'
              : 'border-white/15 bg-black/30',
            'focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:ring-offset-2 focus:ring-offset-black',
            pending && 'cursor-not-allowed',
          ].join(' ')}
        >
          <Image
            src="/images/dune-tracker/swordmaster_8.png"
            alt="Swordmaster cost 8"
            width={256}
            height={256}
            className={[
              'h-auto w-full object-contain transition-opacity duration-200',
              swordmaster8Acquired
                ? 'opacity-100'
                : 'opacity-40 group-hover:opacity-65',
              pending && 'opacity-35',
            ].join(' ')}
          />
          {swordmaster8Acquired && swordmaster && (
            <span className="absolute bottom-2 right-2 rounded-md border border-amber-200/30 bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
              R{swordmaster.round}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleSwordmaster(6)}
          disabled={pending}
          aria-label="Toggle Swordmaster cost 6"
          className={[
            'group relative overflow-hidden rounded-xl border transition-all',
            swordmaster6Acquired
              ? 'border-amber-300/40 bg-amber-100/10'
              : 'border-white/15 bg-black/30',
            'focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:ring-offset-2 focus:ring-offset-black',
            pending && 'cursor-not-allowed',
          ].join(' ')}
        >
          <Image
            src="/images/dune-tracker/swordmaster_6.png"
            alt="Swordmaster cost 6"
            width={256}
            height={256}
            className={[
              'h-auto w-full object-contain transition-opacity duration-200',
              swordmaster6Acquired
                ? 'opacity-100'
                : 'opacity-40 group-hover:opacity-65',
              pending && 'opacity-35',
            ].join(' ')}
          />
          {swordmaster6Acquired && swordmaster && (
            <span className="absolute bottom-2 right-2 rounded-md border border-amber-200/30 bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
              R{swordmaster.round}
            </span>
          )}
        </button>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        Click an active asset again to remove and re-add on the correct round.
      </p>
    </section>
  );
}
