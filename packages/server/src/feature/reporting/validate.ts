import { z } from "zod";

export const dbReportingSchema = z.object({
  id: z.string().uuid(),
  equipment_id: z.string().uuid().nullable(),
  description: z.string(),
  status: z.enum(["pending", "resolved"]),
  created_date: z.date(),
});

export const ReportingSchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid().nullable(),
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

export const GetReportsQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Number of reports to retrieve"),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of reports to skip"),
  status: z.enum(["pending", "resolved"]).optional().describe("Filter by report status"),
});

export const ReportingFilterSchema = GetReportsQuerySchema.pick({
  status: true,
});

export type dbReporting = z.infer<typeof dbReportingSchema>;
export type ReportingByRoomResponse = z.infer<typeof ReportingByRoomResponseSchema>;
export type Reporting = z.infer<typeof ReportingSchema>;
export type GetReportsQueryParams = z.infer<typeof GetReportsQuerySchema>;
export type ReportingFilter = z.infer<typeof ReportingFilterSchema>;
