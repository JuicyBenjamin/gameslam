import { sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgPolicy, pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";
import { slamEntries } from "./slamEntries";
import { users } from "./users";

export const slamComments = pgTable("slam_comments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  parentCommentId: uuid("parent_comment_id").references(
    (): AnyPgColumn => slamComments.id,
  ),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  slamEntryId: uuid("slam_entry_id")
    .notNull()
    .references(() => slamEntries.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  comment: text().notNull(),
}, () => [
  pgPolicy("anon can read slam comments", {
    for: "select",
    to: anonRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can read slam comments", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can insert own slam comments", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`(select auth.uid()) = author_id`,
  }),
  pgPolicy("authenticated can update own slam comments", {
    for: "update",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = author_id`,
  }),
  pgPolicy("authenticated can delete own slam comments", {
    for: "delete",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = author_id`,
  }),
]);
