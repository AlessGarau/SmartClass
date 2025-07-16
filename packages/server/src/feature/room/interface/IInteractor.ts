import { CreateRoomParams, GetRoomsQueryParams, PatchRoomParams, PutRoomParams, Room, RoomSearchParams } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoomsCount(search?: RoomSearchParams): Promise<number>;
  getRoom(id: string): Promise<Room>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  patchRoom(id: string, roomUpdateParams: PatchRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
