import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

import { authUsers } from "drizzle-orm/supabase";
import { slamEntries } from "./slamEntries";

export const slamEntryComments = pgTable("slam_entry_comments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  parentCommentId: uuid("parent_comment_id").references(
    (): AnyPgColumn => slamEntryComments.id,
  ),
  authorId: uuid("author_id")
    .references(() => authUsers.id)
    .notNull(),
  slameEntryId: uuid("slam_entry_id")
    .notNull()
    .references(() => slamEntries.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  comment: text().notNull(),
});
