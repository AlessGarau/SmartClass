import { WeatherData } from "../types";

export interface IWeatherInteractor {
  getWeeklyWeather(): Promise<WeatherData[]>;
} 