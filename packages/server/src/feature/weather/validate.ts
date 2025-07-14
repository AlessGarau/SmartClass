import { z } from "zod";

export const WeatherDataSchema = z.object({
  date: z.string(),
  temperatureMin: z.number(),
  temperatureMax: z.number(),
  condition: z.string(),
  description: z.string(),
  humidity: z.number(),
  windSpeed: z.number(),
});

export const WeatherWeekResponseSchema = z.object({
  data: z.array(WeatherDataSchema),
  message: z.string(),
});

export type WeatherDataType = z.infer<typeof WeatherDataSchema>;
export type WeatherWeekResponseType = z.infer<typeof WeatherWeekResponseSchema>; 