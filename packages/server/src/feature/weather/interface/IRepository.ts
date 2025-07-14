import { Weather, WeatherInsert } from "../../../../database/schema/weather";

export interface IWeatherRepository {
  findByDateRange(startDate: Date, endDate: Date): Promise<Weather[]>;
  findByDate(date: Date): Promise<Weather | null>;
  create(weatherData: WeatherInsert): Promise<Weather>;
  deleteExpired(): Promise<void>;
} 