import type { Lesson } from "../../../../database/schema/lesson";
import type { Class } from "../../../../database/schema/class";
import type { User } from "../../../../database/schema/user";
import { Room } from "../../room/validate";

export interface LessonWithRelations extends Lesson {
  room: Room | null;
  class: Class | null;
  users: User[];
}

export interface ILessonRepository {
  getLessonsForWeek(startDate: Date, endDate: Date): Promise<LessonWithRelations[]>;
  updateLessonRoom(lessonId: string, roomId: string): Promise<void>;
  updateMultipleLessonRooms(updates: Array<{ lessonId: string; roomId: string }>): Promise<void>;
}