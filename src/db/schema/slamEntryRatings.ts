import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

import { authUsers } from "drizzle-orm/supabase";
import { slamEntries } from "./slamEntries";

export const slamEntryRatings = pgTable(
  "slam_entry_ratings",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    authorId: uuid("author_id")
      .references(() => authUsers.id)
      .notNull(),
    slamEntryId: uuid("slam_entry_id")
      .notNull()
      .references(() => slamEntries.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    isRecommended: boolean("is_recommended").notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    content: text().notNull(),
  },
  (table) => [unique().on(table.authorId, table.slamEntryId)],
);
