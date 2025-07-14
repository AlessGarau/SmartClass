import { Room, CreateRoomParams, GetRoomsQueryParams } from "../validate";

export interface IRoomRepository {
  create(RoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoom(id: string): Promise<Room | null>;
  deleteRoom(id: string): Promise<void>;
}
