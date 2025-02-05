import {
  pgTable,
  varchar,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { assets } from "./assets";
import { artists } from "./artists";
import { authUsers } from "drizzle-orm/supabase";

export const slams = pgTable("slams", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  artistId: uuid("artist_id").references(() => artists.id),
  assetId: uuid("asset_id").references(() => assets.id),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => authUsers.id),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});
