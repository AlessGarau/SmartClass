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

export type UserRegisterParams = z.infer<typeof UserRegisterSchema>;
export type UserLoginParams = z.infer<typeof UserLoginSchema>;
export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;
export type UserFullResponse = z.infer<typeof UserFullResponseSchema>;