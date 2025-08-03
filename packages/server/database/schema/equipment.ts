import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { roomTable } from "./room";

export const equipmentTable = pgTable("equipment", {
  id: uuid().primaryKey().defaultRandom(),
  type: varchar({ length: 10, enum: ["ac", "heater"] }).default("heater").notNull(),
  is_functional: boolean().notNull().default(true),
  is_running: boolean().notNull().default(false),
  room_id: uuid().references(() => roomTable.id, { onDelete: "cascade" }),
});

export type Equipment = typeof equipmentTable.$inferSelect; 