import { bigint, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { roomTable } from "./room";
import { sensorTable } from "./sensor";

export const pressureTable = pgTable("pressure", {
  id: bigint({ mode: "number" }).primaryKey(),
  room_id: uuid().references(() => roomTable.id, { onDelete: "cascade" }),
  data: varchar({ length: 255 }).notNull(),
  saved_at: timestamp("saved_at").notNull().defaultNow(),
  sensor_id: uuid().references(() => sensorTable.id, { onDelete: "cascade" }),
});