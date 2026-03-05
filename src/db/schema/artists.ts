import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";

export const artists = pgTable("artists", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  link: varchar({ length: 255 }).notNull(),
}, () => [
  pgPolicy("anon can read artists", {
    for: "select",
    to: anonRole,
    using: sql`true`,
  }),
  pgPolicy("authenticated can read artists", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
]);
