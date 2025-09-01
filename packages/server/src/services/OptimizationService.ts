import { Service } from "typedi";
import axios, { AxiosError } from "axios";

interface OptimizationResponse {
  message: string;
  status: "optimal" | "feasible" | "infeasible";
  dateRange: {
    start: string;
    end: string;
  };
  lessonsOptimized: number;
  totalLessons: number;
  solverStats?: Record<string, any>;
  timestamp: string;
}

interface OptimizationPreferences {
  temperature_weight?: number;
  equipment_weight?: number;
  capacity_weight?: number;
}

@Service()
export class OptimizationService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.DATA_API_URL || "http://smart-class-data-dev:5001";
  }

  /**
   * Optimize room assignments for a given date range
   * @param startDate Start date of the period to optimize
   * @param endDate End date of the period to optimize
   * @param preferences Optional optimization preferences
   */
  async optimizeDateRange(
    startDate: Date,
    endDate: Date,
    preferences?: OptimizationPreferences,
  ): Promise<OptimizationResponse> {
    try {
      const response = await axios.post<OptimizationResponse>(
        `${this.apiUrl}/api/optimize/weekly-planning`,
        {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          preferences: preferences || {
            temperature_weight: 0.3,
            equipment_weight: 0.2,
            capacity_weight: 0.5,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      if (response.data.status !== "optimal" && response.data.status !== "feasible") {
        throw new Error(`Optimization failed: ${response.data.message}`);
      }

      console.log(
        `Successfully optimized ${response.data.lessonsOptimized} lessons ` +
        `from ${response.data.dateRange.start} to ${response.data.dateRange.end}`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("Optimization API error:", axiosError.response.data);
          throw new Error(
            `Optimization API error: ${axiosError.response.status} - ${(axiosError.response.data as any)?.message || "Unknown error"
            }`,
          );
        } else if (axiosError.request) {
          console.error("No response from optimization API");
          throw new Error("Optimization service is not available");
        }
      }

      console.error("Failed to optimize date range:", error);
      throw error;
    }
  }

  /**
   * Check if the optimization service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error("Optimization service health check failed:", error);
      return false;
    }
  }
}