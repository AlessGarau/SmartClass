import { z } from "zod";

export const dbRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number(),
  building: z.string().max(50),
  floor: z.number().int().nonnegative().default(0),
  is_enabled: z.boolean(),
});

export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number(),
  building: z.string().max(50),
  floor: z.number().int().nonnegative().default(0),
  isEnabled: z.boolean(),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(4),
  capacity: z.number().min(1),
  building: z.string(),
  floor: z.number().min(0),
  isEnabled: z.boolean().default(true),
});

export const PutRoomSchema = z.object({
  name: z.string().min(4),
  capacity: z.number().min(1),
  building: z.string(),
  floor: z.number().min(0),
  isEnabled: z.boolean(),
});

export const PatchRoomSchema = z.object({
  name: z.string().min(4).optional(),
  capacity: z.number().min(1).optional(),
  building: z.string().optional(),
  floor: z.number().min(0).optional(),
  isEnabled: z.boolean().optional(),
});

export const RoomFilterSchema = z.object({
  isEnabled: z.boolean().optional(),
  search: z.string().optional().describe("Search term for room names"),
  building: z.string().optional().describe("Filter by building"),
  floor: z.number().optional().describe("Filter by floor"),
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
  building: z.string().optional().describe("Filter by building"),
  floor: z.number().optional().describe("Filter by floor"),
});

export const RoomIdParamsSchema = z.object({
  id: z.string().uuid().describe("Room ID"),
});

export const GetRoomFilterOptionsSchema = z.object({
  building: z.boolean().optional().describe("Get distinct buildings"),
  floor: z.string().optional().describe("Get distinct floor by building"),
});

export const RoomFilterOptionsSchema = z.object({
  buildings: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  floors: z.array(z.object({
    value: z.number(),
    label: z.string(),
  })).optional(),
});

export const RoomCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export const RoomWithMetricsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number(),
  building: z.string().max(50),
  floor: z.number().int().nonnegative().default(0),
  isEnabled: z.boolean(),
  temperature: z.number().nullable(),
  humidity: z.number().nullable(),
  pressure: z.number().nullable(),
  movement: z.string().nullable(),
});

export type dbRoom = z.infer<typeof dbRoomSchema>;
export type dbRowWithMetrics = dbRoom & {
  temperature: string | null;
  humidity: string | null;
  pressure: string | null;
  movement: string | null;
};
export type RoomWithMetrics = z.infer<typeof RoomWithMetricsSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type RoomFilterOptions = z.infer<typeof RoomFilterOptionsSchema>;
export type Count = z.infer<typeof RoomCountSchema>;
export type CreateRoomParams = z.infer<typeof CreateRoomSchema>;
export type GetRoomsQueryParams = z.infer<typeof GetRoomsQuerySchema>;
export type GetRoomFilterOptionsParams = z.infer<typeof GetRoomFilterOptionsSchema>;
export type RoomFilter = z.infer<typeof RoomFilterSchema>;
export type RoomIdParams = z.infer<typeof RoomIdParamsSchema>;
export type PutRoomParams = z.infer<typeof PutRoomSchema>;
export type PatchRoomParams = z.infer<typeof PatchRoomSchema>;
