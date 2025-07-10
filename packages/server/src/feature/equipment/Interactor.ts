import { Service } from "typedi";
import { IEquipmentInteractor } from "./interface/IInteractor";
import { EquipmentRepository } from "./Repository";
import { Equipment } from "../../../database/schema/equipment";

@Service()
export class EquipmentInteractor implements IEquipmentInteractor {
  constructor(private repository: EquipmentRepository) { }

  async findAllByRoomId(roomId: string): Promise<Equipment[]> {
    const equipments = await this.repository.findAllByRoomId(roomId);
    return equipments;
  }
}
