import type { lessonTable } from "../../../../database/schema/lesson";
import type { classTable } from "../../../../database/schema/class";
import type { User } from "../../../../database/schema/user";
import { Room } from "../../room/validate";

// Define select types using Drizzle's inference
type LessonSelect = typeof lessonTable.$inferSelect;
type ClassSelect = typeof classTable.$inferSelect;


export interface LessonWithRelations extends LessonSelect {
  room: Room | null;
  class: ClassSelect | null;
  users: User[];
}

export interface ILessonRepository {
  getLessonsForWeek(startDate: Date, endDate: Date): Promise<LessonWithRelations[]>;
  getLessonById(id: string): Promise<LessonWithRelations | null>;
  updateLessonRoom(lessonId: string, roomId: string): Promise<void>;
  updateMultipleLessonRooms(updates: Array<{ lessonId: string; roomId: string }>): Promise<void>;
  checkRoomAvailability(roomId: string, startTime: Date, endTime: Date, excludeLessonId?: string): Promise<boolean>;
  checkTeacherAvailability(teacherId: string, startTime: Date, endTime: Date, excludeLessonId?: string): Promise<boolean>;
}