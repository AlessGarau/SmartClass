import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { roomTable } from "./room";
import { classTable } from "./class";

export const lessonTable = pgTable("lesson", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
  class_id: uuid().references(() => classTable.id),
  room_id: uuid().references(() => roomTable.id),
});

export type Lesson = typeof lessonTable.$inferSelect;