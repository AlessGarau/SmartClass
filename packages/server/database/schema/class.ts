import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const classTable = pgTable("class", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  student_count: integer().notNull(),
});

export type Class = typeof classTable.$inferSelect;
