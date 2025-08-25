import { z } from "zod";

export const DailySensorDataParamsSchema = z.object({
  roomId: z.string().uuid("Room ID must be a valid UUID"),
});

export const SensorDataPointSchema = z.object({
  timestamp: z.string().datetime(),
  value: z.number(),
});

export const DailySensorDataSchema = z.object({
  roomId: z.string(),
  date: z.string(),
  sensorType: z.enum(["temperature", "humidity", "pressure", "movement"]),
  unit: z.string(),
  data: z.array(SensorDataPointSchema),
});

export const DailySensorDataResponseSchema = z.object({
  data: z.array(DailySensorDataSchema),
  message: z.string(),
});


export type DailySensorDataParams = z.infer<typeof DailySensorDataParamsSchema>;
export type SensorDataPoint = z.infer<typeof SensorDataPointSchema>;
export type DailySensorData = z.infer<typeof DailySensorDataSchema>;
export type DailySensorDataResponse = z.infer<typeof DailySensorDataResponseSchema>;
