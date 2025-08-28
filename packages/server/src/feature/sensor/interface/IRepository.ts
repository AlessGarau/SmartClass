import { DailySensorData } from "../validate";

export interface ISensorRepository {
  getDailySensorData(roomId: string, date: string): Promise<DailySensorData[]>;
}
