'use server';
import { and, asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import {
  duneGame,
  GameType,
  highCouncilAcquired,
  swordmasterAcquired,
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
    highCouncil: {
      id: string;
      round: number;
      timestamp: Date;
    } | null;
    swordmaster: {
      id: string;
      round: number;
      cost: number;
      timestamp: Date;
    } | null;
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
    const games = await db
      .select({
        id: duneGame.id,
        type: duneGame.type,
        timestamp: duneGame.timestamp,
        p1Name: duneGame.p1Name,
        p2Name: duneGame.p2Name,
        p3Name: duneGame.p3Name,
        p4Name: duneGame.p4Name,
      })
      .from(duneGame)
      .where(eq(duneGame.id, id));

    if (games.length === 0) return null;
    const base = games[0];
    const players = [base.p1Name, base.p2Name, base.p3Name, base.p4Name];

    const byPlayer: VPsByPlayer = Object.fromEntries(
      players.map((name) => [
        name,
        {
          vps: [],
          highCouncil: null,
          swordmaster: null,
          total: 0,
        },
      ]),
    );

    const vpRows = await db
      .select({
        id: victoryPointEarned.id,
        playerName: victoryPointEarned.playerName,
        source: victoryPointEarned.source,
        round: victoryPointEarned.round,
        timestamp: victoryPointEarned.timestamp,
      })
      .from(victoryPointEarned)
      .where(eq(victoryPointEarned.gameId, id))
      .orderBy(
        asc(victoryPointEarned.round),
        asc(victoryPointEarned.timestamp),
        asc(victoryPointEarned.id),
      );

    for (const vp of vpRows) {
      if (!byPlayer[vp.playerName]) {
        byPlayer[vp.playerName] = {
          vps: [],
          highCouncil: null,
          swordmaster: null,
          total: 0,
        };
      }
      byPlayer[vp.playerName].vps.push({
        id: vp.id,
        source: vp.source,
        round: vp.round,
        timestamp: vp.timestamp,
      });
      byPlayer[vp.playerName].total += 1;
    }

    const highCouncilRows = await db
      .select({
        id: highCouncilAcquired.id,
        playerName: highCouncilAcquired.playerName,
        round: highCouncilAcquired.round,
        timestamp: highCouncilAcquired.timestamp,
      })
      .from(highCouncilAcquired)
      .where(eq(highCouncilAcquired.gameId, id))
      .orderBy(
        asc(highCouncilAcquired.round),
        asc(highCouncilAcquired.timestamp),
        asc(highCouncilAcquired.id),
      );

    for (const highCouncil of highCouncilRows) {
      if (!byPlayer[highCouncil.playerName]) continue;
      byPlayer[highCouncil.playerName].highCouncil = {
        id: highCouncil.id,
        round: highCouncil.round,
        timestamp: highCouncil.timestamp,
      };
    }

    const swordmasterRows = await db
      .select({
        id: swordmasterAcquired.id,
        playerName: swordmasterAcquired.playerName,
        round: swordmasterAcquired.round,
        cost: swordmasterAcquired.cost,
        timestamp: swordmasterAcquired.timestamp,
      })
      .from(swordmasterAcquired)
      .where(eq(swordmasterAcquired.gameId, id))
      .orderBy(
        asc(swordmasterAcquired.round),
        asc(swordmasterAcquired.timestamp),
        asc(swordmasterAcquired.id),
      );

    for (const swordmaster of swordmasterRows) {
      if (!byPlayer[swordmaster.playerName]) continue;
      byPlayer[swordmaster.playerName].swordmaster = {
        id: swordmaster.id,
        round: swordmaster.round,
        cost: swordmaster.cost,
        timestamp: swordmaster.timestamp,
      };
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
  type: GameType,
  p1Name: string,
  p2Name: string,
  p3Name: string,
  p4Name: string,
) => {
  try {
    const res = await db
      .insert(duneGame)
      .values({ type, p1Name, p2Name, p3Name, p4Name })
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

export const getVpIdFromSource = async (gameId: string, source: VpSource) => {
  const res = await db
    .select({ vpId: victoryPointEarned.id })
    .from(victoryPointEarned)
    .where(
      and(
        eq(victoryPointEarned.gameId, gameId),
        eq(victoryPointEarned.source, source),
      ),
    );

  if (res.length === 0) return null;

  return res[0].vpId;
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

export const addHighCouncilAcquired = async (
  gameId: string,
  playerName: string,
  round: number,
  refresh: boolean = true,
) => {
  try {
    const existing = await db
      .select({ id: highCouncilAcquired.id })
      .from(highCouncilAcquired)
      .where(
        and(
          eq(highCouncilAcquired.gameId, gameId),
          eq(highCouncilAcquired.playerName, playerName),
        ),
      );
    if (existing.length > 0) {
      throw new Error('High council already acquired for this player');
    }

    const added = await db
      .insert(highCouncilAcquired)
      .values({
        gameId,
        playerName,
        round,
      })
      .returning({
        id: highCouncilAcquired.id,
        playerName: highCouncilAcquired.playerName,
        round: highCouncilAcquired.round,
        gameId: highCouncilAcquired.gameId,
        timestamp: highCouncilAcquired.timestamp,
      });
    if (added.length === 0) {
      throw new Error('Not found');
    }
    if (refresh) revalidatePath(`/dune-tracker/${gameId}`, 'page');
    return added[0];
  } catch (err) {
    console.error('[addHighCouncilAcquired] Failed', {
      gameId,
      playerName,
      round,
      err,
    });
    throw new Error('Failed to add high council');
  }
};

export const removeHighCouncilAcquired = async (id: string) => {
  try {
    const deleted = await db
      .delete(highCouncilAcquired)
      .where(eq(highCouncilAcquired.id, id))
      .returning({
        id: highCouncilAcquired.id,
        gameId: highCouncilAcquired.gameId,
      });

    if (deleted.length === 0) {
      throw new Error('Not found');
    }

    revalidatePath(`/dune-tracker/${deleted[0].gameId}`, 'page');
    return deleted[0];
  } catch (err) {
    console.error('[removeHighCouncilAcquired] Failed', { id, err });
    throw new Error('Failed to remove high council');
  }
};

export const addSwordmasterAcquired = async (
  gameId: string,
  playerName: string,
  round: number,
  cost: number,
  refresh: boolean = true,
) => {
  if (cost !== 6 && cost !== 8) {
    throw new Error('Swordmaster cost must be 6 or 8');
  }

  try {
    const existing = await db
      .select({ id: swordmasterAcquired.id })
      .from(swordmasterAcquired)
      .where(
        and(
          eq(swordmasterAcquired.gameId, gameId),
          eq(swordmasterAcquired.playerName, playerName),
        ),
      );
    if (existing.length > 0) {
      throw new Error('Swordmaster already acquired for this player');
    }

    const added = await db
      .insert(swordmasterAcquired)
      .values({
        gameId,
        playerName,
        round,
        cost,
      })
      .returning({
        id: swordmasterAcquired.id,
        playerName: swordmasterAcquired.playerName,
        round: swordmasterAcquired.round,
        cost: swordmasterAcquired.cost,
        gameId: swordmasterAcquired.gameId,
        timestamp: swordmasterAcquired.timestamp,
      });
    if (added.length === 0) {
      throw new Error('Not found');
    }
    if (refresh) revalidatePath(`/dune-tracker/${gameId}`, 'page');
    return added[0];
  } catch (err) {
    console.error('[addSwordmasterAcquired] Failed', {
      gameId,
      playerName,
      round,
      cost,
      err,
    });
    throw new Error('Failed to add swordmaster');
  }
};

export const removeSwordmasterAcquired = async (id: string) => {
  try {
    const deleted = await db
      .delete(swordmasterAcquired)
      .where(eq(swordmasterAcquired.id, id))
      .returning({
        id: swordmasterAcquired.id,
        gameId: swordmasterAcquired.gameId,
      });

    if (deleted.length === 0) {
      throw new Error('Not found');
    }

    revalidatePath(`/dune-tracker/${deleted[0].gameId}`, 'page');
    return deleted[0];
  } catch (err) {
    console.error('[removeSwordmasterAcquired] Failed', { id, err });
    throw new Error('Failed to remove swordmaster');
  }
};
