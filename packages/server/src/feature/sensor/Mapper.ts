import { Service } from "typedi";
import { ISensorMapper } from "./interface/IMapper";
import { DailySensorData } from "./validate";

@Service()
export class SensorMapper implements ISensorMapper {
  
  toDailySensorDataResponse(data: DailySensorData[]): DailySensorData[] {
    return data.map(sensorData => ({
      roomId: sensorData.roomId,
      date: sensorData.date,
      sensorType: sensorData.sensorType,
      unit: sensorData.unit,
      data: sensorData.data.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    }));
  }
}
