import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const classTable = pgTable("class", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().unique(),
  student_count: integer().notNull(),
}); 