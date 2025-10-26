import { notFound } from 'next/navigation';
import { GameTrackerClient } from '@/components/dune-tracker/game-tracker-client';
import { getGameDataById } from '@/actions/duneTrackerAction';

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  console.log(params.id);
  const game = await getGameDataById(params.id);
  if (!game) return notFound();

  return <GameTrackerClient initialGame={game} />;
}

// Mock data for development
// helpers to make timestamps progress by round
// const baseDate = new Date('2025-01-15T19:00:00Z');
// const ts = (round: number, offsetMins = 0) =>
//   new Date(baseDate.getTime() + (round * 10 + offsetMins) * 60_000);

// export const mockGameData = {
//   id: '1',
//   timestamp: baseDate,
//   p1Name: 'Ben',
//   p2Name: 'Calvin',
//   p3Name: 'Ethan',
//   p4Name: 'Kevin',
//   byPlayer: {
//     Ben: {
//       vps: [
//         {
//           id: 'b-001',
//           source: 'misc_4p' as VpSource,
//           round: 1,
//           timestamp: ts(1, 1),
//         },
//         {
//           id: 'b-002',
//           source: 'conflict_i' as VpSource,
//           round: 3,
//           timestamp: ts(3, 2),
//         },
//         {
//           id: 'b-003',
//           source: 'card_ixian_engineer' as VpSource,
//           round: 4,
//           timestamp: ts(4, 3),
//         },
//         {
//           id: 'b-004',
//           source: 'alliance_fremen' as VpSource,
//           round: 6,
//           timestamp: ts(6, 2),
//         },
//         {
//           id: 'b-005',
//           source: 'conflict_ii' as VpSource,
//           round: 7,
//           timestamp: ts(7, 4),
//         },
//         {
//           id: 'b-006',
//           source: 'spice_must_flow' as VpSource,
//           round: 9,
//           timestamp: ts(9, 1),
//         },
//       ],
//       total: 6,
//     },
//     Calvin: {
//       vps: [
//         {
//           id: 'c-001',
//           source: 'misc_4p' as VpSource,
//           round: 1,
//           timestamp: ts(1, 2),
//         },
//         {
//           id: 'c-002',
//           source: 'friendship_emperor' as VpSource,
//           round: 2,
//           timestamp: ts(2, 3),
//         },
//         {
//           id: 'c-003',
//           source: 'intrigue_the_sleeper_must_awaken' as VpSource,
//           round: 4,
//           timestamp: ts(4, 6),
//         },
//         {
//           id: 'c-004',
//           source: 'card_sayyadina' as VpSource,
//           round: 5,
//           timestamp: ts(5, 2),
//         },
//         {
//           id: 'c-005',
//           source: 'conflict_iii' as VpSource,
//           round: 8,
//           timestamp: ts(8, 3),
//         },
//       ],
//       total: 5,
//     },
//     Ethan: {
//       vps: [
//         {
//           id: 'e-001',
//           source: 'misc_4p' as VpSource,
//           round: 1,
//           timestamp: ts(1, 3),
//         },
//         {
//           id: 'e-002',
//           source: 'tech_flagship' as VpSource,
//           round: 3,
//           timestamp: ts(3, 5),
//         },
//         {
//           id: 'e-003',
//           source: 'alliance_spacing_guild' as VpSource,
//           round: 3,
//           timestamp: ts(5, 1),
//         },
//         {
//           id: 'e-004',
//           source: 'card_opulence' as VpSource,
//           round: 3,
//           timestamp: ts(6, 5),
//         },
//         {
//           id: 'e-005',
//           source: 'conflict_ii' as VpSource,
//           round: 7,
//           timestamp: ts(7, 2),
//         },
//       ],
//       total: 5,
//     },
//     Kevin: {
//       vps: [
//         {
//           id: 'k-001',
//           source: 'misc_4p' as VpSource,
//           round: 1,
//           timestamp: ts(1, 4),
//         },
//         {
//           id: 'k-002',
//           source: 'friendship_fremen' as VpSource,
//           round: 2,
//           timestamp: ts(2, 2),
//         },
//         {
//           id: 'k-003',
//           source: 'tech_spy_satellites' as VpSource,
//           round: 4,
//           timestamp: ts(4, 2),
//         },
//         {
//           id: 'k-004',
//           source: 'intrigue_endgame' as VpSource,
//           round: 10,
//           timestamp: ts(10, 0),
//         },
//       ],
//       total: 4,
//     },
//   },
// };
