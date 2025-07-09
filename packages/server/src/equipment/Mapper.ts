import { Service } from "typedi";
import { IEquipmentMapper, EquipmentByRoomResponse } from "./interface/IMapper";
import { Equipment } from "../../database/schema/equipment";

@Service()
export class EquipmentMapper implements IEquipmentMapper {
  toResponse(equipment: Equipment): EquipmentByRoomResponse {
    return {
      id: equipment.id,
      type: equipment.type,
      isFunctional: equipment.is_functional,
      isRunning: equipment.is_running,
      roomId: equipment.room_id!,
    };
  }
}
