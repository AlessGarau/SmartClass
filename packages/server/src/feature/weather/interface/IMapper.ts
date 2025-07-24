import { Weather, WeatherInsert } from "../../../../database/schema/weather";
import { WeatherData } from "../types";

export interface IWeatherMapper {
  toResponse(weather: Weather): WeatherData;
  toWeatherInsert(weatherData: WeatherData, expiresAt: Date): WeatherInsert;
} 