import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { classTable } from "./class";
import { roomTable } from "./room";

export const lessonTable = pgTable("lesson", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
  class_id: uuid().references(() => classTable.id, { onDelete: "cascade" }),
  room_id: uuid().references(() => roomTable.id),
});

export type Lesson = typeof lessonTable.$inferSelect;