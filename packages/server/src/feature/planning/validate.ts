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
  weekNumber: z.number().min(1).max(53),
});

export const WeeklyPlanningQuerySchema = z.object({
  year: z.number().min(2024).max(2100).optional(),
  building: z.string().optional(),
  floor: z.number().optional(),
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

export const FileUploadSchema = z.object({
  filename: z.string().endsWith(".xlsx", "File must be an Excel file (.xlsx)"),
  mimetype: z.enum([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ], {
    errorMap: () => ({ message: "File must be an Excel file" }),
  }),
  file: z.instanceof(Buffer),
});

export const ImportedLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
  class_name: z.string().min(1, "Class name is required"),
  teacher_name: z.string().min(1, "Teacher name is required"),
});

export const ImportErrorSchema = z.object({
  row: z.number(),
  field: z.string().optional(),
  message: z.string(),
});

export const ImportResultSchema = z.object({
  importedCount: z.number(),
  skippedCount: z.number(),
  errors: z.array(ImportErrorSchema),
});

export const ImportLessonResponseSchema = z.object({
  message: z.string(),
  importedCount: z.number(),
  skippedCount: z.number(),
  errors: z.array(ImportErrorSchema),
});

export const WeeklyPlanningResponseSchema = z.object({
  data: WeekPlanningResultSchema,
  message: z.string(),
});

export const PlanningFilterOptionsSchema = z.object({
  buildings: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  floors: z.array(z.object({
    value: z.number(),
    label: z.string(),
  })),
});

export const PlanningFilterOptionsResponseSchema = z.object({
  data: PlanningFilterOptionsSchema,
  message: z.string(),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ImportedLesson = z.infer<typeof ImportedLessonSchema>;
export type ImportResult = z.infer<typeof ImportResultSchema>;
export type ImportError = z.infer<typeof ImportErrorSchema>;
export type ImportLessonResponse = z.infer<typeof ImportLessonResponseSchema>;
export type WeeklyPlanningResponse = z.infer<typeof WeeklyPlanningResponseSchema>;
export type PlanningFilterOptions = z.infer<typeof PlanningFilterOptionsSchema>;
export type PlanningFilterOptionsResponse = z.infer<typeof PlanningFilterOptionsResponseSchema>;