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

export const PatchRoomSchema = z.object({
  name: z.string().min(4).optional(),
  capacity: z.number().min(1).optional(),
  is_enabled: z.boolean().optional(),
});

export const RoomFilterSchema = z.object({
  isEnabled: z.boolean().optional(),
  search: z.string().optional().describe("Search term for room names"),
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
  isEnabled: z.boolean().optional(),
  search: z.string().optional().describe("Search term for room names"),
});

export const RoomIdParamsSchema = z.object({
  id: z.string().uuid().describe("Room ID"),
});

export const RoomCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type Room = z.infer<typeof RoomSchema>;
export type Count = z.infer<typeof RoomCountSchema>;
export type CreateRoomParams = z.infer<typeof CreateRoomSchema>;
export type GetRoomsQueryParams = z.infer<typeof GetRoomsQuerySchema>;
export type RoomFilter = z.infer<typeof RoomFilterSchema>;
export type RoomIdParams = z.infer<typeof RoomIdParamsSchema>;
export type PutRoomParams = z.infer<typeof PutRoomSchema>;
export type PatchRoomParams = z.infer<typeof PatchRoomSchema>;
