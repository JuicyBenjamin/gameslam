import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const assets = pgTable("assets", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});