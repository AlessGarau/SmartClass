import { pgTable, uuid } from "drizzle-orm/pg-core";
import { lessonTable } from "./lesson";
import { userTable } from "./user";

export const userLessonTable = pgTable("user_lesson", {
  user_id: uuid().references(() => userTable.id, { onDelete: "cascade" }),
  lesson_id: uuid().references(() => lessonTable.id, { onDelete: "cascade" }),
}); 