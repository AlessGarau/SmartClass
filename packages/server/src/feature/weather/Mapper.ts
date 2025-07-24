import { Service } from "typedi";
import { IWeatherMapper } from "./interface/IMapper";
import { Weather, WeatherInsert } from "../../../database/schema/weather";
import { WeatherData } from "./types";

@Service()
export class WeatherMapper implements IWeatherMapper {
  toResponse(weather: Weather): WeatherData {
    return {
      date: weather.date,
      temperatureMin: weather.temperature_min,
      temperatureMax: weather.temperature_max,
      condition: weather.condition,
      description: weather.description || "",
      humidity: weather.humidity || 0,
      windSpeed: parseFloat(weather.wind_speed || "0"),
    };
  }

  toWeatherInsert(weatherData: WeatherData, expiresAt: Date): WeatherInsert {
    return {
      date: weatherData.date,
      temperature_min: weatherData.temperatureMin,
      temperature_max: weatherData.temperatureMax,
      condition: weatherData.condition,
      description: weatherData.description,
      humidity: weatherData.humidity,
      wind_speed: weatherData.windSpeed.toString(),
      expires_at: expiresAt,
    };
  }
} 