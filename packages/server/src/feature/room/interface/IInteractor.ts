import {
  CreateRoomParams,
  GetRoomFilterOptionsParams,
  GetRoomsQueryParams,
  PatchRoomParams,
  PutRoomParams,
  Room,
  RoomFilter,
  RoomFilterOptions,
} from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoomFilterOptions(params: GetRoomFilterOptionsParams): Promise<RoomFilterOptions>;
  getRoomsCount(search?: RoomFilter): Promise<number>;
  getRoom(id: string): Promise<Room>;
  putRoom(id: string, roomUpdateParams: PutRoomParams): Promise<Room>;
  patchRoom(id: string, roomUpdateParams: PatchRoomParams): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
