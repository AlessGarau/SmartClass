import { Service } from "typedi";
import { IWeatherInteractor } from "./interface/IInteractor";
import { WeatherRepository } from "./Repository";
import { WeatherService } from "./WeatherService";
import { WeatherData } from "./types";
import { WeatherInsert } from "../../../database/schema/weather";

@Service()
export class WeatherInteractor implements IWeatherInteractor {
  constructor(
    private weatherRepository: WeatherRepository,
    private weatherService: WeatherService,
  ) {}

  async getWeeklyWeather(): Promise<WeatherData[]> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const cachedData = await this.weatherRepository.findByDateRange(today, nextWeek);
    
    if (cachedData.length >= 7) {
      return this.transformDbDataToResponse(cachedData);
    }

    await this.weatherRepository.deleteExpired();

    try {
      const freshData = await this.weatherService.fetchWeeklyWeather();
      
      await this.saveFreshData(freshData);
      
      return freshData;
    } catch (error) {
      console.error("Failed to fetch fresh weather data:", error);
      
      if (cachedData.length > 0) {
        return this.transformDbDataToResponse(cachedData);
      }
      
      throw error;
    }
  }

  private async saveFreshData(weatherData: WeatherData[]): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    for (const data of weatherData) {
      const weatherInsert: WeatherInsert = {
        date: data.date,
        temperature_min: data.temperatureMin,
        temperature_max: data.temperatureMax,
        condition: data.condition,
        description: data.description,
        humidity: data.humidity,
        wind_speed: data.windSpeed.toString(),
        expires_at: expiresAt,
      };

      await this.weatherRepository.create(weatherInsert);
    }
  }

  private transformDbDataToResponse(dbData: any[]): WeatherData[] {
    return dbData.map(weather => ({
      date: weather.date,
      temperatureMin: weather.temperature_min,
      temperatureMax: weather.temperature_max,
      condition: weather.condition,
      description: weather.description || "",
      humidity: weather.humidity || 0,
      windSpeed: parseFloat(weather.wind_speed || "0"),
    }));
  }
} 