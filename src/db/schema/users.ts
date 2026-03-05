import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, varchar, uuid, boolean } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const users = pgTable("users", {
  id: uuid()
    .notNull()
    .references(() => authUsers.id)
    .primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  avatarLink: varchar("avatar_link", { length: 255 }).notNull(),
}, () => [
  pgPolicy("anon can read users", {
    for: "select",
    to: anonRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can read users", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can update own profile", {
    for: "update",
    to: authenticatedRole,
    using: sql`(select auth.uid()) = id`,
  }),
]);

export type TSelectUser = typeof authUsers.$inferSelect;

export type TUser = typeof users.$inferSelect;
