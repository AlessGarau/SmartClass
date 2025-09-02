import { apiClient } from "../client";

export interface SensorDataPoint {
    timestamp: string;
    value: number;
}

export interface DailySensorData {
    roomId: string;
    date: string;
    sensorType: "temperature" | "humidity" | "pressure" | "movement";
    unit: string;
    data: SensorDataPoint[];
}

export const sensorApi = {
    getDailySensorData: async (
        roomId: string
    ): Promise<{ data: DailySensorData[] }> => {
        const response = await apiClient.get(`/sensor/daily/${roomId}`);
        return response.data;
    },
};
