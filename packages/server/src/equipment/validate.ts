import { z } from "zod";

export const equipmentParamsSchema = z.object({
  id: z.string().uuid("ID de salle invalide"),
});

export type EquipmentParams = z.infer<typeof equipmentParamsSchema>;
