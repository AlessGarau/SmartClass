import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { equipmentTable } from "./equipment";

export const reportingTable = pgTable("reporting", {
  id: uuid().primaryKey().defaultRandom(),
  equipment_id: uuid().references(() => equipmentTable.id),
  description: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 255, enum: ['pending', 'resolved'] }).default('pending').notNull(),
  created_date: timestamp("created_date").notNull().defaultNow(),
}); 