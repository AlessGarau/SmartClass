import { Room, CreateRoomParams, GetRoomsQueryParams, PutRoomParams } from "../validate";

export interface IRoomRepository {
  create(RoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoom(id: string): Promise<Room | null>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
