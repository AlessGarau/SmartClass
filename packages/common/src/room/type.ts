import { z } from "zod";

export const SalleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const SalleCreateSchema = z.object({
  name: z
    .string()
    .min(6, "Le nom de la salle doit contenir au moins 6 caractères"),
});
