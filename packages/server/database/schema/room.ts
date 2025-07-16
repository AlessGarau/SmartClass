import { sql } from "drizzle-orm";
import { pgTable, varchar, uuid, integer, boolean, check } from "drizzle-orm/pg-core";

export const roomTable = pgTable("room", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).unique().notNull(),
  capacity: integer().notNull(),
  is_enabled: boolean().notNull().default(true),
},
(table) => [
  check("capacity_check1", sql`${table.capacity} > 0`),
]);