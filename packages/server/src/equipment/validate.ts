import { z } from "zod";

export const equipmentParamsSchema = z.object({
  id: z.string().uuid("ID de salle invalide"),
});

export type EquipmentParams = z.infer<typeof equipmentParamsSchema>;

export const EquipmentByRoomResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  isFunctional: z.boolean(),
  isRunning: z.boolean(),
  roomId: z.string(),
});

export type EquipmentByRoomResponse = z.infer<typeof EquipmentByRoomResponseSchema>;
