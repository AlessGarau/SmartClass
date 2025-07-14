import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number(),
  is_enabled: z.boolean(),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(4),
  capacity: z.number().min(1),
  is_enabled: z.boolean().default(true),
});

export const PutRoomSchema = z.object({
  name: z.string().min(4),
  capacity: z.number().min(1),
  is_enabled: z.boolean(),
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

export const GetRoomParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("Room ID"),
});

export type Room = z.infer<typeof RoomSchema>;
export type CreateRoomParams = z.infer<typeof CreateRoomSchema>;
export type GetRoomsQueryParams = z.infer<typeof GetRoomsQuerySchema>;
export type GetRoomParams = z.infer<typeof GetRoomParamsSchema>;
export type PutRoomParams = z.infer<typeof PutRoomSchema>;
