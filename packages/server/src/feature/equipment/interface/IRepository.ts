import { Equipment } from "../../../../database/schema/equipment";

export interface IEquipmentRepository {
  findAllByRoomId(roomId: string): Promise<Equipment[]>;
}
