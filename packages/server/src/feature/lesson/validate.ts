import { z } from "zod";

export const LessonIdParamsSchema = z.object({
  lessonId: z.string().uuid("Lesson ID must be a valid UUID"),
});

export const UpdateLessonBodySchema = z.object({
  title: z.string().min(1, "Subject is required"),
  teacher: z.string().uuid("Teacher must be a valid UUID"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
  dayOfWeek: z.enum(["LUN", "MAR", "MER", "JEU", "VEN"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const PlannedLessonSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  className: z.string(),
  teacher: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  dayOfWeek: z.enum(["LUN", "MAR", "MER", "JEU", "VEN"]),
  date: z.string(),
});

export const UpdateLessonResponseSchema = z.object({
  message: z.string(),
  data: PlannedLessonSchema,
});

export const DeleteLessonResponseSchema = z.object({
  message: z.string(),
});

export type LessonIdParams = z.infer<typeof LessonIdParamsSchema>;
export type UpdateLessonBody = z.infer<typeof UpdateLessonBodySchema>;
export type PlannedLesson = z.infer<typeof PlannedLessonSchema>;
export type UpdateLessonResponse = z.infer<typeof UpdateLessonResponseSchema>;
export type DeleteLessonResponse = z.infer<typeof DeleteLessonResponseSchema>;