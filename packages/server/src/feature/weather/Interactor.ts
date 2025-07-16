import { Service } from "typedi";
import { IWeatherInteractor } from "./interface/IInteractor";
import { WeatherRepository } from "./Repository";
import { WeatherService } from "./WeatherService";
import { WeatherMapper } from "./Mapper";
import { WeatherData } from "./types";

@Service()
export class WeatherInteractor implements IWeatherInteractor {
  constructor(
    private weatherRepository: WeatherRepository,
    private weatherService: WeatherService,
    private weatherMapper: WeatherMapper,
  ) {}

  async getWeeklyWeather(): Promise<WeatherData[]> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const cachedData = await this.weatherRepository.findByDateRange(today, nextWeek);
    
    if (cachedData.length >= 7) {
      return cachedData.map(weather => this.weatherMapper.toResponse(weather));
    }

    await this.weatherRepository.deleteExpired();

    try {
      const freshData = await this.weatherService.fetchWeeklyWeather();
      
      await this.saveFreshData(freshData);
      
      return freshData;
    } catch (error) {
      console.error("Failed to fetch fresh weather data:", error);
      
      if (cachedData.length > 0) {
        return cachedData.map(weather => this.weatherMapper.toResponse(weather));
      }
      
      throw error;
    }
  }

  private async saveFreshData(weatherData: WeatherData[]): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    for (const data of weatherData) {
      const weatherInsert = this.weatherMapper.toWeatherInsert(data, expiresAt);
      await this.weatherRepository.create(weatherInsert);
    }
  }


} 