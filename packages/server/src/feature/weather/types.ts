export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
    relative_humidity_2m_mean: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    relative_humidity_2m_mean: number[];
  };
}

export interface WeatherData {
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherWeekResponse {
  data: WeatherData[];
  message: string;
} 