import { DailySensorData } from "../validate";


export interface ISensorMapper {
  toDailySensorDataResponse(data: DailySensorData[]): DailySensorData[];
}
