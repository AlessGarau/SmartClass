import { apiClient } from "../client";

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

export const weatherApi = {
    getWeeklyWeather: async (): Promise<WeatherWeekResponse> => {
        const response = await apiClient.get("/weather/week");
        return response.data;
    },
};
