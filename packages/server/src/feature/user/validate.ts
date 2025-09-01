import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  deviceToken: z.string().optional(),
});

export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["teacher", "admin"]),
});

export const UserMeResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["teacher", "admin"]),
});

export const UserFullResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["teacher", "admin"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TeacherOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const TeacherOptionsResponseSchema = z.object({
  data: z.array(TeacherOptionSchema),
  message: z.string(),
});

export const GetUsersQuerySchema = z.object({
  role: z.enum(["admin", "teacher"]).optional(),
  search: z.string().optional(),
});

export type UserRegisterParams = z.infer<typeof UserRegisterSchema>;
export type UserLoginParams = z.infer<typeof UserLoginSchema>;
export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;
export type UserFullResponse = z.infer<typeof UserFullResponseSchema>;
export type TeacherOption = z.infer<typeof TeacherOptionSchema>;
export type TeacherOptionsResponse = z.infer<typeof TeacherOptionsResponseSchema>;
export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;