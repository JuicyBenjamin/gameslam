import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";
import { slamEntries } from "./slamEntries";
import { users } from "./users";

export const slamEntryRatings = pgTable(
  "slam_entry_ratings",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    authorId: uuid("author_id")
      .references(() => users.id)
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
  (table) => [
    unique().on(table.authorId, table.slamEntryId),
    pgPolicy("anon can read entry ratings", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    pgPolicy("authenticated can read entry ratings", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert own entry ratings", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = author_id`,
    }),
    pgPolicy("authenticated can update own entry ratings", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = author_id`,
    }),
    pgPolicy("authenticated can delete own entry ratings", {
      for: "delete",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = author_id`,
    }),
  ],
);
