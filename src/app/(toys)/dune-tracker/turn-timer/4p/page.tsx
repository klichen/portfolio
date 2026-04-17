import { redirect } from 'next/navigation';
import { TurnTimerClient } from '@/components/dune-tracker/turn-timer-client';
import {
  parseTimerColors,
  parseTimerNames,
} from '@/components/dune-tracker/turn-timer-config';

export default function FourPlayerTurnTimerPage({
  searchParams,
}: {
  searchParams: { colors?: string | string[]; names?: string | string[] };
}) {
  const colors = parseTimerColors(searchParams.colors, 4);
  const names = parseTimerNames(searchParams.names, 4);

  if (!colors) {
    redirect('/dune-tracker/turn-timer');
  }

  return <TurnTimerClient playerCount={4} colors={colors} names={names} />;
}
