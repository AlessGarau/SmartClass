import { z } from "zod";

export const dbTeacherSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["teacher", "admin"]),
  first_name: z.string(),
  last_name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const TeacherSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["teacher", "admin"]),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTeacherSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export const GetTeachersQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Number of teachers to retrieve"),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of teachers to skip"),
  search: z.string().optional().describe("Search term for teacher last names"),
});

export const PutTeacherSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export const PatchTeacherSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
});

export const TeacherFilterSchema = GetTeachersQuerySchema.pick({
  search: true,
});

export const TeacherIdParamsSchema = z.object({
  id: z.string().uuid().describe("Teacher ID"),
});

export const TeachersCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type dbTeacher = z.infer<typeof dbTeacherSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;
export type CreateTeacherParams = z.infer<typeof CreateTeacherSchema>;
export type GetTeachersQueryParams = z.infer<typeof GetTeachersQuerySchema>;
export type PutTeacherParams = z.infer<typeof PutTeacherSchema>;
export type PatchTeacherParams = z.infer<typeof PatchTeacherSchema>;
export type TeacherFilter = z.infer<typeof TeacherFilterSchema>;
export type TeacherIdParams = z.infer<typeof TeacherIdParamsSchema>;
export type Count = z.infer<typeof TeachersCountSchema>;