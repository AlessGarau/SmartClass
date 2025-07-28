import { z } from "zod";
import { RoomResponseSchema, RoomSchema } from "../room/validate";

export const PlannedClassSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  teacher: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  dayOfWeek: z.enum(["LUN", "MAR", "MER", "JEU", "VEN"]),
});

export const RoomWithPlannedClassesSchema = RoomResponseSchema.extend({
  plannedClasses: z.array(PlannedClassSchema),
});

export const WeekPlanningResultSchema = z.object({
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2024).max(2100),
  classrooms: z.array(RoomWithPlannedClassesSchema),
});

export const WeeklyPlanningParamsSchema = z.object({
  weekNumber: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1).max(53)),
});

export const WeeklyPlanningQuerySchema = z.object({
  year: z.string().transform((val) => parseInt(val)).pipe(z.number().min(2024).max(2100)).optional(),
  building: z.string().optional(),
  floor: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
});

export const OptimizePlanningParamsSchema = z.object({
  weekNumber: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1).max(53)),
});

export const OptimizePlanningBodySchema = z.object({
  year: z.number().min(2024).max(2100).optional(),
});

export const WeeklyPlanningDataSchema = z.object({
  lessons: z.array(z.any()),
  rooms: z.array(RoomSchema),
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2024).max(2100),
});

export type PlannedClass = z.infer<typeof PlannedClassSchema>;
export type RoomWithPlannedClasses = z.infer<typeof RoomWithPlannedClassesSchema>;
export type WeeklyPlanningData = z.infer<typeof WeeklyPlanningDataSchema>;
export type WeeklyPlanningParams = z.infer<typeof WeeklyPlanningParamsSchema>;
export type WeeklyPlanningQuery = z.infer<typeof WeeklyPlanningQuerySchema>;
export type WeeklyPlanningResult = z.infer<typeof WeekPlanningResultSchema>;
export type OptimizePlanningParams = z.infer<typeof OptimizePlanningParamsSchema>;
export type OptimizePlanningBody = z.infer<typeof OptimizePlanningBodySchema>;