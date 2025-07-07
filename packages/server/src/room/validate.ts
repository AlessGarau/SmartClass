import { z } from "zod";
import { SalleSchema, SalleCreateSchema } from "@monorepo/common";

export type Salle = z.infer<typeof SalleSchema>;
export type SalleCreateParams = z.infer<typeof SalleCreateSchema>;
