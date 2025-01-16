import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});

export const assets = pgTable("assets", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});

export const artistAssets = pgTable("artist_assets", {
  artistId: uuid()
    .notNull()
    .references(() => artists.id),
  assetId: uuid()
    .notNull()
    .references(() => assets.id),
});
