import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { sensorTable } from "./sensor";
import { roomTable } from "./room";

export const temperatureTable = pgTable("temperature", {
  id: uuid().primaryKey().defaultRandom(),
  room_id: uuid().references(() => roomTable.id),
  data: varchar({ length: 255 }).notNull(),
  saved_at: timestamp("saved_at").notNull().defaultNow(),
  sensor_id: uuid().references(() => sensorTable.id),
}); 