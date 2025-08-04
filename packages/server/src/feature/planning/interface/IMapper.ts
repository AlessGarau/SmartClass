import type { LessonWithRelations } from "../../lesson/interface/IRepository";
import type { Room } from "../../room/validate";
import type { RoomWithPlannedClasses, WeeklyPlanningResult } from "../validate";

export interface IPlanningMapper {
  toWeekPlanningData(lessons: LessonWithRelations[], rooms: Room[], startDate: Date, endDate: Date, year: number): WeeklyPlanningResult;
  toClassroom(room: Room, lessons: LessonWithRelations[]): RoomWithPlannedClasses;
}