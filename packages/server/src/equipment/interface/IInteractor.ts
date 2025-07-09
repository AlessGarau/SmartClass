import { Equipment } from "../../../database/schema/equipment";

export interface IEquipmentInteractor {
  findAllByRoomId(roomId: string): Promise<Equipment[]>;
}
