import { apiClient } from "../client";
import type { DailySensorDataResponse } from "../../types/Sensor";

export const sensorApi = {
    getDailySensorData: async (
        roomId: string
    ): Promise<DailySensorDataResponse> => {
        const response = await apiClient.get(`/sensor/daily/${roomId}`);
        return response.data;
    },
};
