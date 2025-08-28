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

export interface DailySensorDataResponse {
    data: DailySensorData[];
    message: string;
}
