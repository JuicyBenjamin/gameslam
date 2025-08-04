import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});