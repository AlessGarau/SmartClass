import { Room, RoomCreateParams, GetRoomsQueryParams } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: RoomCreateParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
}
