import type { userTable } from "../../../../database/schema/user";

// Define select types using Drizzle's inference
type UserSelect = typeof userTable.$inferSelect;

export interface WeeklyPlanningFilters {
  weekNumber: number;
  year: number;
  building?: string;
  floor?: number;
}

export interface RoomEnvironmentalData {
  roomId: string;
  temperature: number;
  humidity: number;
  airPressure: number;
  comfortScore: number;
}

export interface IPlanningRepository {
  getTeachers(): Promise<UserSelect[]>;
}