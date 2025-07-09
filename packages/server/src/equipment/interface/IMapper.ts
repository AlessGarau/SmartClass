import { Equipment } from "../../../database/schema/equipment";

export interface EquipmentByRoomResponse {
  id: string;
  type: string;
  isFunctional: boolean;
  isRunning: boolean;
  roomId: string;
}

export interface IEquipmentMapper {
  toResponse(equipment: Equipment): EquipmentByRoomResponse;
}
