import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(["teacher", "admin"]),
});