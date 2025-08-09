import type { UpdateLessonBody, PlannedLesson } from "../validate";

export interface ILessonInteractor {
  updateLesson(lessonId: string, lessonData: UpdateLessonBody): Promise<PlannedLesson>;
  deleteLesson(lessonId: string): Promise<void>;
}