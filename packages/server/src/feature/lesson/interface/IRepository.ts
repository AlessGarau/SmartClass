import type { Lesson } from "../../../../database/schema/lesson";
import type { Class } from "../../../../database/schema/class";
import type { User } from "../../../../database/schema/user";
import { Room } from "../../room/validate";

export interface LessonWithRelations extends Lesson {
  room: Room | null;
  class: Class | null;
  users: User[];
}

export interface CreateLessonData {
  title: string;
  startTime: Date;
  endTime: Date;
  classId: string;
  roomId: string | null;
}

export interface ILessonRepository {
  getLessonsForWeek(startDate: Date, endDate: Date, roomIds?: string[]): Promise<LessonWithRelations[]>;
  updateLessonRoom(lessonId: string, roomId: string): Promise<void>;
  updateMultipleLessonRooms(updates: Array<{ lessonId: string; roomId: string }>): Promise<void>;
  createLesson(data: CreateLessonData): Promise<Lesson>;
  findLessonByDetails(classId: string, startTime: Date, endTime: Date): Promise<Lesson | null>;
  getLessonById(lessonId: string): Promise<Lesson | null>;
  deleteLesson(lessonId: string): Promise<void>;
}