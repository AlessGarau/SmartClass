
import { WeeklyPlanningData, ImportResult, PlanningFilterOptions } from "../validate";

export interface IPlanningInteractor {
  getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningData>;
  getLessonTemplate(): Promise<Buffer>;
  importLessonsFromTemplate(fileBuffer: Buffer): Promise<ImportResult>;
  getFilterOptions(): Promise<PlanningFilterOptions>;
}

export interface WeeklyPlanningFilters {
  startDate: string;
  endDate: string;
  year: number;
  building?: string;
  floor?: number;
}