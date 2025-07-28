
import { WeeklyPlanningData } from "../validate";

export interface IPlanningInteractor {
  getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningData>;
  getLessonTemplate(): Promise<string>;
}

export interface WeeklyPlanningFilters {
  weekNumber: number;
  year: number;
  building?: string;
  floor?: number;
}