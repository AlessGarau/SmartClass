import { DailySensorData } from "../validate";

export interface ISensorInteractor {
  getDailySensorData(roomId: string): Promise<DailySensorData[]>;
}
