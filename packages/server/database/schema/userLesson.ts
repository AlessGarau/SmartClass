import { pgTable, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { lessonTable } from "./lesson";

export const userLessonTable = pgTable("user_lesson", {
  user_id: uuid().references(() => userTable.id),
  lesson_id: uuid().references(() => lessonTable.id),
}); 