import { CreateRoomParams, GetRoomsQueryParams, PatchRoomParams, PutRoomParams, Room, RoomSearchParams } from "../validate";

export interface IRoomRepository {
  create(RoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoomsCount(params?: RoomSearchParams): Promise<number>;
  getRoom(id: string): Promise<Room | null>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  patchRoom(id: string, roomUpdateParams: PatchRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
