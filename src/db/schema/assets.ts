import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";

export const assets = pgTable("assets", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
}, () => [
  pgPolicy("anon can read assets", {
    for: "select",
    to: anonRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can read assets", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
]);
