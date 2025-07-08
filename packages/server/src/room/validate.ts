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
    .min(6, "Le nom de la salle doit contenir au moins 6 caractères"),
  capacity: z.number().min(1, "La capacité doit être supérieure à 0"),
  is_enabled: z.boolean().default(true),
});

export type Room = z.infer<typeof RoomSchema>;
export type RoomCreateParams = z.infer<typeof RoomCreateSchema>;
