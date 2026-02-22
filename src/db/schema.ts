import {
  pgTable,
  uuid,
  text,
  timestamp,
  smallint,
  pgEnum,
} from 'drizzle-orm/pg-core';

export type GameType = 'base' | 'uprising';

export const gameTypeEnum = pgEnum('type', ['base', 'uprising']);

export const baseVpSourceValues = [
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

export const uprisingVpSourceValues = [
  'bene_gesserit_alliance',
  'bene_gesserit_friendship',
  'conflict_vp',
  'corinth_city_card',
  'crysknife_match',
  'delivery_agreement_card',
  'desert_mouse_muad-dib_match',
  'emperor_alliance',
  'emperor_friendship',
  'endgame_card',
  'endgame_tech',
  'fremen_alliance',
  'fremen_friendship',
  'fringe_worlds_6p_alliance',
  'fringe_worlds_6p_friendship',
  'great_houses_6p_alliance',
  'great_houses_6p_friendship',
  'junction_headquarters_card',
  'opportunism_intrigue',
  'ornithopter_match',
  'priority_contract_card',
  'sardaukar_high_command_tech',
  'smuggler_haven_card',
  'spacing_guild_alliance',
  'spacing_guild_friendship',
  'strategic_stockpiling_spice_intrigue',
  'strategic_stockpiling_water_intrigue',
  'the_spice_must_flow_card',
  'threaten_spice_production_6p_card',
  'wild_card_icon_match',
  'y-kroon_five_spice_leader',
] as const;

export const vpSourceValues = [
  ...baseVpSourceValues,
  ...uprisingVpSourceValues,
] as const;

export type VpSource = (typeof vpSourceValues)[number];

export const vpSourceEnum = pgEnum('vp_source', vpSourceValues);

export const duneGame = pgTable('dune_game', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: gameTypeEnum().default('base'),
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

export const highCouncilAcquired = pgTable('high_council_acquired', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => duneGame.id, { onDelete: 'cascade' }),
  playerName: text('player_name').notNull(),
  round: smallint('round').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const swordmasterAcquired = pgTable('swordmaster_acquired', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => duneGame.id, { onDelete: 'cascade' }),
  playerName: text('player_name').notNull(),
  round: smallint('round').notNull(),
  cost: smallint('cost').notNull(), // 8 or 6
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});
