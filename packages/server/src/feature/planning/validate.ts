import { z } from "zod";
import { RoomSchema } from "../room/validate";

export const PlannedClassSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  teacher: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  dayOfWeek: z.enum(["LUN", "MAR", "MER", "JEU", "VEN"]),
});

export const RoomWithPlannedClassesSchema = RoomSchema.extend({
  plannedClasses: z.array(PlannedClassSchema),
});

export const WeekPlanningResultSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  year: z.number().min(2024).max(2100),
  classrooms: z.array(RoomWithPlannedClassesSchema),
});

export const WeeklyPlanningQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  year: z.number().min(2024).max(2100).optional(),
  building: z.string().optional(),
  floor: z.number().optional(),
});

export const WeeklyPlanningDataSchema = z.object({
  lessons: z.array(z.any()),
  rooms: z.array(RoomSchema),
  startDate: z.date(),
  endDate: z.date(),
  year: z.number().min(2024).max(2100),
});

export type PlannedClass = z.infer<typeof PlannedClassSchema>;
export type RoomWithPlannedClasses = z.infer<typeof RoomWithPlannedClassesSchema>;
export type WeeklyPlanningData = z.infer<typeof WeeklyPlanningDataSchema>;
export type WeeklyPlanningQuery = z.infer<typeof WeeklyPlanningQuerySchema>;
export type WeeklyPlanningResult = z.infer<typeof WeekPlanningResultSchema>;

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
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
  className: z.string().min(1, "Class name is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
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

export const DeleteLessonParamsSchema = z.object({
  lessonId: z.string().uuid("Lesson ID must be a valid UUID"),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ImportedLesson = z.infer<typeof ImportedLessonSchema>;
export type ImportResult = z.infer<typeof ImportResultSchema>;
export type ImportError = z.infer<typeof ImportErrorSchema>;
export type ImportLessonResponse = z.infer<typeof ImportLessonResponseSchema>;
export type WeeklyPlanningResponse = z.infer<typeof WeeklyPlanningResponseSchema>;
export type PlanningFilterOptions = z.infer<typeof PlanningFilterOptionsSchema>;
export type PlanningFilterOptionsResponse = z.infer<typeof PlanningFilterOptionsResponseSchema>;
export type DeleteLessonParams = z.infer<typeof DeleteLessonParamsSchema>;