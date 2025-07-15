import { CreateRoomParams, GetRoomsQueryParams, PatchRoomParams, PutRoomParams, Room } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoom(id: string): Promise<Room>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  patchRoom(id: string, roomUpdateParams: PatchRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
