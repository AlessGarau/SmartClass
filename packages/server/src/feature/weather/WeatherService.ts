import { Service } from "typedi";
import axios from "axios";
import { OpenMeteoResponse, WeatherData } from "./types";
import { WeatherError } from "../../middleware/error/weatherError";

@Service()
export class WeatherService {
  private readonly baseUrl = "https://api.open-meteo.com/v1/forecast";
  private readonly latitude = 48.8566; // Coordonées de Paris
  private readonly longitude = 2.3522; 

  async fetchWeeklyWeather(): Promise<WeatherData[]> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const startDate = today.toISOString().split("T")[0];
    const endDate = nextWeek.toISOString().split("T")[0];

    const url = `${this.baseUrl}?latitude=${this.latitude}&longitude=${this.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean&timezone=Europe/Paris&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await axios.get<OpenMeteoResponse>(url);
      return this.transformResponse(response.data);
    } catch (error) {
      throw WeatherError.apiFetchFailed(error as Error);
    }
  }

  private transformResponse(response: OpenMeteoResponse): WeatherData[] {
    const { daily } = response;
    const weatherData: WeatherData[] = [];

    for (let i = 0; i < daily.time.length; i++) {
      const precipitation = daily.precipitation_sum[i] || 0;
      
      weatherData.push({
        date: daily.time[i],
        temperatureMin: Math.round(daily.temperature_2m_min[i]),
        temperatureMax: Math.round(daily.temperature_2m_max[i]),
        condition: this.getConditionFromPrecipitation(precipitation),
        description: this.getDescriptionFromWeather(
          daily.temperature_2m_max[i],
          precipitation,
          daily.wind_speed_10m_max[i],
        ),
        humidity: Math.round(daily.relative_humidity_2m_mean[i] || 0),
        windSpeed: Math.round((daily.wind_speed_10m_max[i] || 0) * 100) / 100,
      });
    }

    return weatherData;
  }

  private getConditionFromPrecipitation(precipitation: number): string {
    if (precipitation > 10) {return "rainy";}
    if (precipitation > 2) {return "light-rain";}
    if (precipitation > 0) {return "cloudy";}
    return "sunny";
  }

  private getDescriptionFromWeather(tempMax: number, precipitation: number, windSpeed: number): string {
    let description = "";

    if (tempMax > 25) {description += "Chaud";}
    else if (tempMax > 15) {description += "Doux";}
    else if (tempMax > 5) {description += "Frais";}
    else {description += "Froid";}

    if (precipitation > 10) {description += " avec fortes pluies";}
    else if (precipitation > 2) {description += " avec pluie";}
    else if (precipitation > 0) {description += " avec quelques gouttes";}

    if (windSpeed > 20) {description += " et venteux";}

    return description;
  }
} 