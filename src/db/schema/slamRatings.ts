import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { slamEntries } from "./slamEntries";
import { users } from "./users";

export const slamRatings = pgTable("slam_ratings", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  slameEntryId: uuid("slam_entry_id")
    .notNull()
    .references(() => slamEntries.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isRecommended: boolean("is_recommended").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  content: text().notNull(),
});
