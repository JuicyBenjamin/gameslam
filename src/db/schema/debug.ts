import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const debug = pgTable("debug", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: varchar({ length: 255 }).notNull(),
  data: varchar({ length: 255 }).notNull(),
});
