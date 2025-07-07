import { pgTable, bigint, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { roomTable } from "./room";
import { sensorTable } from "./sensor";

export const movementTable = pgTable("movement", {
  id: bigint({ mode: "number" }).primaryKey(),
  room_id: uuid().references(() => roomTable.id),
  data: varchar({ length: 255 }).notNull(),
  saved_at: timestamp("saved_at").notNull().defaultNow(),
  sensor_id: uuid().references(() => sensorTable.id),
}); 