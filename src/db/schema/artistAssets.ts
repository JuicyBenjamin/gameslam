import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
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
  (table) => ({
    uniqueArtistAsset: unique().on(table.artistId, table.assetId),
  }),
);
