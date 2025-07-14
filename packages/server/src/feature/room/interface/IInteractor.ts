import { Room, CreateRoomParams, GetRoomsQueryParams, PutRoomParams } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoom(id: string): Promise<Room>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
