import { pgTable, varchar, uuid, integer, boolean } from "drizzle-orm/pg-core";

export const roomTable = pgTable("room", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  capacity: integer().notNull(),
  is_enabled: boolean().notNull().default(true),
});