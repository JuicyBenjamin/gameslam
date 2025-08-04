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
import { users } from "./users";

export const slams = pgTable("slams", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  artistId: uuid("artist_id")
    .notNull()
    .references(() => artists.id),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

export type SelectSlam = typeof slams.$inferSelect;