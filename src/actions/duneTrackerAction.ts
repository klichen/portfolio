'use server';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import {
  duneGame,
  victoryPointEarned,
  type DuneGame,
  type VpSource,
} from '@/db/schema';
import { unstable_noStore as noStore } from 'next/cache';

export type VPsByPlayer = Record<
  string,
  {
    vps: Array<{
      id: string;
      source: VpSource;
      round: number;
      timestamp: Date;
    }>;
    total: number;
  }
>;

export type PlayerVpData = VPsByPlayer[string];

export type GameData = {
  byPlayer: VPsByPlayer;
} & DuneGame;

export const getGameDataById = async (id: string): Promise<GameData | null> => {
  try {
    noStore();
    const rows = await db
      .select({
        game: {
          id: duneGame.id,
          timestamp: duneGame.timestamp,
          p1Name: duneGame.p1Name,
          p2Name: duneGame.p2Name,
          p3Name: duneGame.p3Name,
          p4Name: duneGame.p4Name,
        },
        vp: {
          id: victoryPointEarned.id,
          playerName: victoryPointEarned.playerName,
          source: victoryPointEarned.source,
          round: victoryPointEarned.round,
          timestamp: victoryPointEarned.timestamp,
        },
      })
      .from(duneGame)
      .leftJoin(victoryPointEarned, eq(victoryPointEarned.gameId, duneGame.id))
      .where(eq(duneGame.id, id))
      .orderBy(
        asc(victoryPointEarned.round),
        asc(victoryPointEarned.timestamp),
        asc(victoryPointEarned.id),
      );

    if (rows.length === 0) return null;
    const base = rows[0].game;
    const players = [base.p1Name, base.p2Name, base.p3Name, base.p4Name];

    const byPlayer: VPsByPlayer = Object.fromEntries(
      players.map((name) => [name, { vps: [], total: 0 }]),
    );

    for (const r of rows) {
      const vp = r.vp;
      if (!vp?.id) continue;
      if (!byPlayer[vp.playerName]) {
        byPlayer[vp.playerName] = { vps: [], total: 0 };
      }
      byPlayer[vp.playerName].vps.push({
        id: vp.id,
        source: vp.source,
        round: vp.round,
        timestamp: vp.timestamp,
      });
      byPlayer[vp.playerName].total += 1;
    }

    return {
      ...base,
      byPlayer,
    };
  } catch (err) {
    console.error('[getGameDataById] Failed to fetch game', { id, err });
    return null;
  }
};

export const createGame = async (
  p1Name: string,
  p2Name: string,
  p3Name: string,
  p4Name: string,
) => {
  try {
    const res = await db
      .insert(duneGame)
      .values({ p1Name, p2Name, p3Name, p4Name })
      .returning({
        gameId: duneGame.id,
        p1: duneGame.p1Name,
        p2: duneGame.p2Name,
        p3: duneGame.p3Name,
        p4: duneGame.p4Name,
      });

    if (res.length !== 1 || !res[0]?.gameId) {
      throw new Error('Insert did not return an id');
    }

    const gameId = res[0].gameId;
    const players = [res[0].p1, res[0].p2, res[0].p3, res[0].p4];

    await Promise.all(
      players.map((name) => addVictoryPoint(gameId, name, 'misc_4p', 1, false)),
    );
    return res[0].gameId;
  } catch (err) {
    console.error('[createGame] Failed to create game', {
      p1Name,
      p2Name,
      p3Name,
      p4Name,
      err,
    });
    throw new Error('Failed to create game');
  }
};

export const addVictoryPoint = async (
  gameId: string,
  playerName: string,
  source: VpSource,
  round: number,
  refresh: boolean = true,
) => {
  try {
    const added = await db
      .insert(victoryPointEarned)
      .values({
        gameId,
        playerName,
        source,
        round,
      })
      .returning({
        id: victoryPointEarned.id,
        playerName: victoryPointEarned.playerName,
        source: victoryPointEarned.source,
        round: victoryPointEarned.round,
        gameId: victoryPointEarned.gameId,
        timestamp: victoryPointEarned.timestamp,
      });
    if (added.length === 0) {
      throw new Error('Not found');
    }
    if (refresh) revalidatePath(`/dune-tracker/${gameId}`, 'page');
  } catch (err) {
    console.error('[addVictoryPoint] Failed', {
      gameId,
      playerName,
      source,
      round,
      err,
    });
    throw new Error('Failed to add victory point');
  }
};

export const editVictoryPoint = async (id: string, newSource: VpSource) => {
  try {
    const updated = await db
      .update(victoryPointEarned)
      .set({ source: newSource })
      .where(eq(victoryPointEarned.id, id))
      .returning({
        id: victoryPointEarned.id,
        playerName: victoryPointEarned.playerName,
        source: victoryPointEarned.source,
        round: victoryPointEarned.round,
        gameId: victoryPointEarned.gameId,
        timestamp: victoryPointEarned.timestamp,
      });

    if (updated.length === 0) {
      throw new Error('Not found');
    }

    revalidatePath(`/dune-tracker/${updated[0].gameId}`, 'page');
    return updated[0];
  } catch (err) {
    console.error('[editVictoryPoint] Failed', { id, newSource, err });
    throw new Error('Failed to edit victory point');
  }
};

export const removeVictoryPoint = async (id: string) => {
  try {
    const deleted = await db
      .delete(victoryPointEarned)
      .where(eq(victoryPointEarned.id, id))
      .returning({
        id: victoryPointEarned.id,
        gameId: victoryPointEarned.gameId,
      });

    if (deleted.length === 0) {
      throw new Error('Not found');
    }

    revalidatePath(`/dune-tracker/${deleted[0].gameId}`, 'page');
    return deleted[0];
  } catch (err) {
    console.error('[removeVictoryPoint] Failed', { id, err });
    throw new Error('Failed to remove victory point');
  }
};
