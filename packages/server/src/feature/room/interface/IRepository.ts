import { Room, RoomCreateParams, GetRoomsQueryParams } from "../validate";

export interface IRoomRepository {
  create(RoomCreateParams: RoomCreateParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
}
