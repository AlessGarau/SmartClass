import type { LessonWithRelations } from "../../lesson/interface/IRepository";
import type { Classroom, WeekPlanningData } from "./IInteractor";

export interface IPlanningMapper {
  toWeekPlanningData(lessons: LessonWithRelations[], rooms: any[], weekNumber: number, year: number): WeekPlanningData;
  toClassroom(room: any, lessons: LessonWithRelations[]): Classroom;
}