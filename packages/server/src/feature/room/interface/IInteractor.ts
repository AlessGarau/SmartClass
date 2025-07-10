import { Room, RoomCreateParams } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: RoomCreateParams): Promise<Room>;
}
