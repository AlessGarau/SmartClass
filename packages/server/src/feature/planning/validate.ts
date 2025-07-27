import { z } from "zod";

export const weeklyPlanningParamsSchema = z.object({
  weekNumber: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1).max(53)),
});

export const weeklyPlanningQuerySchema = z.object({
  year: z.string().transform((val) => parseInt(val)).pipe(z.number().min(2024).max(2100)).optional(),
  building: z.string().optional(),
  floor: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
});

export const optimizePlanningParamsSchema = z.object({
  weekNumber: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1).max(53)),
});

export const optimizePlanningBodySchema = z.object({
  year: z.number().min(2024).max(2100).optional(),
});

export type WeeklyPlanningParams = z.infer<typeof weeklyPlanningParamsSchema>;
export type WeeklyPlanningQuery = z.infer<typeof weeklyPlanningQuerySchema>;
export type OptimizePlanningParams = z.infer<typeof optimizePlanningParamsSchema>;
export type OptimizePlanningBody = z.infer<typeof optimizePlanningBodySchema>;