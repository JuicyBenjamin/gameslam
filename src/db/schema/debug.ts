import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const debug = pgTable("debug", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  type: varchar({ length: 255 }).notNull(),
  data: varchar({ length: 255 }).notNull(),
});
