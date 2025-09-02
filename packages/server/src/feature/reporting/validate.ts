import { z } from "zod";

export const dbReportingSchema = z.object({
  id: z.string().uuid(),
  equipment_id: z.string().uuid().nullable(),
  description: z.string(),
  status: z.enum(["pending", "resolved"]),
  created_date: z.date(),
});

export const dbReportingExtendSchema = z.object({
  id: z.string().uuid(),
  equipment_id: z.string().uuid().nullable(),
  description: z.string(),
  status: z.enum(["pending", "resolved"]),
  created_date: z.date(),
  equipment_type: z.string(),
  room_name: z.string(),
});

export const ReportingSchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid().nullable(),
  description: z.string(),
  status: z.string(),
  createdDate: z.date(),
  equipmentType: z.string(),
  roomName: z.string(),
});

export const EquipmentSchema = z.object({
  id: z.string(),
  type: z.string(),
  isFunctional: z.boolean(),
  isRunning: z.boolean(),
  roomId: z.string(),
});

export const CreateReportingSchema = z.object({
  equipmentId: z.string().uuid().nullable(),
  description: z.string(),
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
  equipmentType: z.enum(["ac", "heater"]).optional().describe("Filter by equipment type"),
  roomName: z.string().optional().describe("Filter by room name"),
});

export const PatchReportingSchema = z.object({
  status: z.enum(["pending", "resolved"]).optional(),
});

export const ReportingIdParamsSchema = z.object({
  id: z.string().uuid().describe("Reporting ID"),
});

export const ReportingFilterSchema = GetReportsQuerySchema.pick({
  status: true,
  equipmentType: true,
  roomName: true,
});

export const ReportsCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type dbReporting = z.infer<typeof dbReportingSchema>;
export type dbReportingExtend = z.infer<typeof dbReportingExtendSchema>;
export type ReportingByRoomResponse = z.infer<typeof ReportingByRoomResponseSchema>;
export type Reporting = z.infer<typeof ReportingSchema>;
export type CreateReportingParams = z.infer<typeof CreateReportingSchema>;
export type GetReportsQueryParams = z.infer<typeof GetReportsQuerySchema>;
export type ReportingFilter = z.infer<typeof ReportingFilterSchema>;
export type PatchReportingParams = z.infer<typeof PatchReportingSchema>;
export type ReportingIdParams = z.infer<typeof ReportingIdParamsSchema>;
export type Count = z.infer<typeof ReportsCountSchema>;