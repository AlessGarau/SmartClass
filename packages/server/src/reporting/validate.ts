import { z } from "zod";

export const ReportingSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  description: z.string(),
  status: z.string(),
  createdDate: z.date(),
});

export const EquipmentSchema = z.object({
  id: z.string(),
  type: z.string(),
  isFunctional: z.boolean(),
  isRunning: z.boolean(),
  roomId: z.string(),
});

export const ReportingByRoomResponseSchema = z.object({
  reporting: ReportingSchema,
  equipment: EquipmentSchema.nullable(),
});

export type ReportingByRoomResponse = z.infer<typeof ReportingByRoomResponseSchema>;