import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";
import { slams } from "./slams";
import { users } from "./users";

export const slamEntries = pgTable("slam_entries", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  slamId: uuid("slam_id")
    .notNull()
    .references(() => slams.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  linkToEntry: varchar("link_to_entry", { length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, () => [
  pgPolicy("anon can read entries", {
    for: "select",
    to: anonRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can read entries", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can insert own entries", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`(select auth.uid()) = user_id`,
  }),
  pgPolicy("authenticated can update own entries", {
    for: "update",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = user_id`,
  }),
  pgPolicy("authenticated can delete own entries", {
    for: "delete",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = user_id`,
  }),
]);
