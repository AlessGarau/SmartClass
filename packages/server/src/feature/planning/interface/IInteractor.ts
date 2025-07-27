export interface PlannedClass {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
  dayOfWeek: "LUN" | "MAR" | "MER" | "JEU" | "VEN";
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  plannedClasses: PlannedClass[];
}

export interface WeekPlanningData {
  weekNumber: number;
  year: number;
  classrooms: Classroom[];
}

import type { LessonWithRelations } from "../../lesson/interface/IRepository";
import type { roomTable } from "../../../../database/schema/room";

type RoomSelect = typeof roomTable.$inferSelect;

export interface WeeklyPlanningResult {
  lessons: LessonWithRelations[];
  rooms: RoomSelect[];
  weekNumber: number;
  year: number;
}

export interface IPlanningInteractor {
  getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningResult>;
  optimizePlanning(weekNumber: number, year: number): Promise<void>;
}

export interface WeeklyPlanningFilters {
  weekNumber: number;
  year: number;
  building?: string;
  floor?: number;
}