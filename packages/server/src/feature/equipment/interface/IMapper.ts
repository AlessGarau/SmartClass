import { Equipment } from "../../../../database/schema/equipment";
import { EquipmentByRoomResponse } from "../validate";

export interface IEquipmentMapper {
  toResponse(equipment: Equipment): EquipmentByRoomResponse;
}
