import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

import { TrackResult } from 'server/spotify/types';

export const users = sqliteTable('users', {
  email: text('email').primaryKey(),
  safeId: text('safeId').unique().notNull(),
  name: text('name').notNull(),
  verified: integer('verified', {
    mode: 'boolean',
  })
    .notNull()
    .default(false),
  loginHash: text('login_hash'),
  loginSalt: text('login_salt'),
  loginTimestamp: integer('login_timestamp', {
    mode: 'timestamp_ms',
  }),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').references(() => users.email),
  created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  last_seen: integer('last_seen', { mode: 'timestamp_ms' }).notNull(),
  ua: text('ua').notNull(),
});

export const bangers = sqliteTable(
  'bangers',
  {
    // TODO: should be .notNull()
    songId: text('song_id'),
    // TODO: should be .notNull()
    userId: text('user_id').references(() => users.email),
    songKey: text('song_key').notNull().default(''),
    bangedAt: integer('banged_at', { mode: 'timestamp_ms' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.songId, table.userId] }),
  }),
);

export const globalBangers = sqliteTable(
  'global_bangers',
  {
    songKey: text('song_key').primaryKey(),
    addedAt: integer('added_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.songKey] }),
  }),
);

export const songCache = sqliteTable('song_cache', {
  songId: text('song_id').primaryKey(),
  data: text('data', { mode: 'json' }).$type<TrackResult>(),
});

export const normalizedSongCache = sqliteTable('normalized_song_cache', {
  songKey: text('song_key').primaryKey(),
  data: text('data', { mode: 'json' }).$type<TrackResult>(),
});

export const userGroup = sqliteTable('user_group', {
  id: text('id').primaryKey(),
  joinKey: text('join_key').notNull().unique(),
  iconIndex: integer('icon_index').notNull(),
  name: text('name').notNull(),
  description: text('description'),
});

export const userToGroup = sqliteTable(
  'user_to_group',
  {
    userId: text('user_id').references(() => users.email),
    groupId: text('group_id').references(() => userGroup.id),
    role: text('role', { enum: ['admin', 'member'] }).default('member'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.groupId] }),
  }),
);
