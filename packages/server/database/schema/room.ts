import { sql } from "drizzle-orm";
import { pgTable, varchar, uuid, integer, boolean, check } from "drizzle-orm/pg-core";

export const roomTable = pgTable("room", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).unique().notNull(),
  capacity: integer().notNull(),
  is_enabled: boolean().notNull().default(true),
  building: varchar({ length: 50 }).notNull().default("batA"),
  floor: integer().notNull().default(0),
},
(table) => [
  check("capacity_check1", sql`${table.capacity} > 0`),
  check("floor_check", sql`${table.floor} >= 0`),
]);