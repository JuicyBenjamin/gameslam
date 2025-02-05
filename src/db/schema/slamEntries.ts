import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { slams } from "./slams";

export const slamEntries = pgTable("slam_entries", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  slamId: uuid("slam_id")
    .notNull()
    .references(() => slams.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  linkToEntry: varchar("link_to_entry", { length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
