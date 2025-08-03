import { z } from "zod";

export const ClassSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  student_count: z.number(),
});

export const CreateClassSchema = z.object({
  name: z.string().min(4),
  student_count: z.number().min(1),
});

export const GetClassesQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Number of classes to retrieve"),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of classes to skip"),
  search: z.string().optional().describe("Search term for class names"),
});

export const PutClassSchema = z.object({
  name: z.string().min(4),
  student_count: z.number().min(1),
});

export const PatchClassSchema = z.object({
  name: z.string().min(4).optional(),
  student_count: z.number().min(1).optional(),
});

export const ClassFilterSchema = GetClassesQuerySchema.pick({
  search: true,
});

export const ClassIdParamsSchema = z.object({
  id: z.string().uuid().describe("Class ID"),
});

export const ClassesCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type Class = z.infer<typeof ClassSchema>;
export type CreateClassParams = z.infer<typeof CreateClassSchema>;
export type GetClassesQueryParams = z.infer<typeof GetClassesQuerySchema>;
export type PutClassParams = z.infer<typeof PutClassSchema>;
export type PatchClassParams = z.infer<typeof PatchClassSchema>;
export type ClassFilter = z.infer<typeof ClassFilterSchema>;
export type ClassIdParams = z.infer<typeof ClassIdParamsSchema>;
export type Count = z.infer<typeof ClassesCountSchema>;