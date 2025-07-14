import { Room, CreateRoomParams, GetRoomsQueryParams } from "../validate";

export interface IRoomInteractor {
  createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room>;
  getRooms(params: GetRoomsQueryParams): Promise<Room[]>;
  getRoom(id: string): Promise<Room | null>;
}
