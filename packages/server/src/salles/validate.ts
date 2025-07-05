import { z } from "zod";

export const SalleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type SalleParams = Omit<z.infer<typeof SalleSchema>, "id">;
export type Salle = z.infer<typeof SalleSchema>;
