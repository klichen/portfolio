import {
  pgTable,
  uuid,
  text,
  timestamp,
  smallint,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const vpSourceValues = [
  'alliance_bene_gesserit',
  'alliance_emperor',
  'alliance_fremen',
  'alliance_spacing_guild',
  'card_guild_ambassador',
  'card_ixian_engineer',
  'card_opulence',
  'card_sayyadina',
  'conflict_i',
  'conflict_ii',
  'conflict_iii',
  'friendship_bene_gesserit',
  'friendship_emperor',
  'friendship_fremen',
  'friendship_spacing_guild',
  'intrigue_choam_shares',
  'intrigue_endgame',
  'intrigue_staged_incident',
  'intrigue_the_sleeper_must_awaken',
  'misc_4p',
  'tech_detonation_devices',
  'tech_endgame',
  'tech_flagship',
  'tech_spy_satellites',
  'spice_must_flow',
] as const;

export type VpSource = (typeof vpSourceValues)[number];

export const vpSourceEnum = pgEnum('vp_source', vpSourceValues);

export const duneGame = pgTable('dune_game', {
  id: uuid('id').primaryKey().defaultRandom(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),

  p1Name: text('p1_name').notNull(),
  p2Name: text('p2_name').notNull(),
  p3Name: text('p3_name').notNull(),
  p4Name: text('p4_name').notNull(),
});

export type DuneGame = typeof duneGame.$inferSelect;

export const victoryPointEarned = pgTable('victory_point_earned', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => duneGame.id, { onDelete: 'cascade' }),
  playerName: text('player_name').notNull(),
  source: vpSourceEnum('source').notNull(),
  round: smallint('round').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});
