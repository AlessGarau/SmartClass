import { Service } from "typedi";
import type { RoomEnvironmentalData } from "../interface/IRepository";

@Service()
export class EnvironmentalDataService {
  /**
   * Mock service to simulate getting environmental data from ML server
   * In production, this would make HTTP requests to the Python ML server
   */
  async getRoomEnvironmentalData(roomIds: string[]): Promise<RoomEnvironmentalData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock environmental data for each room
    return roomIds.map(roomId => {
      // Generate realistic random values
      const temperature = this.generateRandomValue(18, 26, 1); // 18-26°C
      const humidity = this.generateRandomValue(30, 70, 0); // 30-70%
      const airPressure = this.generateRandomValue(1010, 1025, 1); // 1010-1025 hPa
      
      // Calculate comfort score based on environmental factors
      const comfortScore = this.calculateComfortScore(temperature, humidity, airPressure);

      return {
        roomId,
        temperature,
        humidity,
        airPressure,
        comfortScore,
      };
    });
  }

  /**
   * Get forecast data for a specific date range
   * This would typically call the ML prediction endpoint
   */
  async getRoomEnvironmentalForecast(
    roomIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, RoomEnvironmentalData[]>> {
    const forecastMap = new Map<string, RoomEnvironmentalData[]>();

    for (const roomId of roomIds) {
      const forecasts: RoomEnvironmentalData[] = [];
      
      // Generate hourly forecasts for the date range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Only generate for working hours (8:00 - 18:00)
        if (currentDate.getHours() >= 8 && currentDate.getHours() <= 18) {
          const temperature = this.generateRandomValue(18, 26, 1);
          const humidity = this.generateRandomValue(30, 70, 0);
          const airPressure = this.generateRandomValue(1010, 1025, 1);
          
          forecasts.push({
            roomId,
            temperature,
            humidity,
            airPressure,
            comfortScore: this.calculateComfortScore(temperature, humidity, airPressure),
          });
        }
        
        currentDate.setHours(currentDate.getHours() + 1);
      }
      
      forecastMap.set(roomId, forecasts);
    }

    return forecastMap;
  }

  private generateRandomValue(min: number, max: number, decimals: number): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
  }

  private calculateComfortScore(
    temperature: number,
    humidity: number,
    airPressure: number
  ): number {
    // Simple comfort score calculation
    // Ideal: 20-22°C, 40-60% humidity, 1013-1020 hPa
    
    let score = 100;
    
    // Temperature scoring (ideal: 20-22°C)
    if (temperature < 20 || temperature > 22) {
      const tempDiff = temperature < 20 ? 20 - temperature : temperature - 22;
      score -= tempDiff * 5; // -5 points per degree away from ideal
    }
    
    // Humidity scoring (ideal: 40-60%)
    if (humidity < 40 || humidity > 60) {
      const humidityDiff = humidity < 40 ? 40 - humidity : humidity - 60;
      score -= humidityDiff * 1; // -1 point per % away from ideal
    }
    
    // Air pressure scoring (ideal: 1013-1020 hPa)
    if (airPressure < 1013 || airPressure > 1020) {
      const pressureDiff = airPressure < 1013 ? 1013 - airPressure : airPressure - 1020;
      score -= pressureDiff * 2; // -2 points per hPa away from ideal
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
}