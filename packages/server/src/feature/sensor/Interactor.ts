import { Service } from "typedi";
import { ISensorInteractor } from "./interface/IInteractor";
import { SensorRepository } from "./Repository";
import { DailySensorData } from "./validate";

@Service()
export class SensorInteractor implements ISensorInteractor {
  constructor(private _repository: SensorRepository) {}

  async getDailySensorData(roomId: string): Promise<DailySensorData[]> {
    const today = new Date();
    const date = today.getFullYear() + "-" + 
                 String(today.getMonth() + 1).padStart(2, "0") + "-" + 
                 String(today.getDate()).padStart(2, "0");
    
    return this._repository.getDailySensorData(roomId, date);
  }
}
