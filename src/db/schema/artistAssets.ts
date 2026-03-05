import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";
import { assets } from "./assets";
import { artists } from "./artists";

export const artistAssets = pgTable(
  "artist_assets",
  {
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id),
  },
  (table) => [
    unique().on(table.artistId, table.assetId),
    pgPolicy("anon can read artist_assets", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    pgPolicy("authenticated can read artist_assets", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ],
);
