
import { WeeklyPlanningData, ImportResult, PlanningFilterOptions } from "../validate";

export interface IPlanningInteractor {
  getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningData>;
  getLessonTemplate(): Promise<Buffer>;
  importLessonsFromTemplate(fileBuffer: Buffer): Promise<ImportResult>;
  getFilterOptions(): Promise<PlanningFilterOptions>;
}

export interface WeeklyPlanningFilters {
  weekNumber: number;
  year: number;
  building?: string;
  floor?: number;
}