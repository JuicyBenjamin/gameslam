import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { users } from "./users";

export const debug = pgTable("debug", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: varchar({ length: 255 }).notNull(),
  data: varchar({ length: 255 }).notNull(),
}, () => [
  pgPolicy("authenticated can insert own debug", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`(select auth.uid()) = user_id`,
  }),
]);
