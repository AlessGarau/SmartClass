import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number(),
  is_enabled: z.boolean(),
});

export const RoomCreateSchema = z.object({
  name: z
    .string()
    .min(4),
  capacity: z.number().min(1),
  is_enabled: z.boolean().default(true),
});

export const GetRoomsQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Number of rooms to retrieve"),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of rooms to skip"),
});

export type Room = z.infer<typeof RoomSchema>;
export type RoomCreateParams = z.infer<typeof RoomCreateSchema>;
export type GetRoomsQueryParams = z.infer<typeof GetRoomsQuerySchema>;
