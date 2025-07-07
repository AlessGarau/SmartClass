import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { roomTable } from "./room";

export const sensorTable = pgTable("sensor", {
  id: uuid().primaryKey().defaultRandom(),
  room_id: uuid().references(() => roomTable.id),
  physical_id: varchar({ length: 255 }).notNull(),
}); 