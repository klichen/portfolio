import { redirect } from 'next/navigation';
import { TurnTimerClient } from '@/components/dune-tracker/turn-timer-client';
import {
  parseTimerColors,
  parseTimerNames,
} from '@/components/dune-tracker/turn-timer-config';

export default function ThreePlayerTurnTimerPage({
  searchParams,
}: {
  searchParams: { colors?: string | string[]; names?: string | string[] };
}) {
  const colors = parseTimerColors(searchParams.colors, 3);
  const names = parseTimerNames(searchParams.names, 3);

  if (!colors) {
    redirect('/dune-tracker/turn-timer');
  }

  return <TurnTimerClient playerCount={3} colors={colors} names={names} />;
}
