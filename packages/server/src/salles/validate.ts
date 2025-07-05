import { z } from "zod";

export const SalleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const SalleCreateSchema = z.object({
  name: z.string(),
});

export type Salle = z.infer<typeof SalleSchema>;
export type SalleCreateParams = z.infer<typeof SalleCreateSchema>;
