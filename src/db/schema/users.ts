import { pgTable, varchar, uuid, boolean } from "drizzle-orm/pg-core";

import { authUsers } from "drizzle-orm/supabase";

export const users = pgTable("users", {
  id: uuid()
    .notNull()
    .references(() => authUsers.id)
    .primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  avatarLink: varchar("avatar_link", { length: 255 }).notNull(),
});

export type SelectUser = typeof authUsers.$inferSelect;

export type TUser = typeof users.$inferSelect;