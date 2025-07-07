import { Room, RoomCreateParams } from "../validate";

export interface IRoomRepository {
  create(RoomCreateParams: RoomCreateParams): Promise<Room>;
}
