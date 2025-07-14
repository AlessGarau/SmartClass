import { Service } from "typedi";
import { IRoomInteractor } from "./interface/IInteractor";
import { CreateRoomParams, Room, GetRoomsQueryParams } from "./validate";
import { RoomRepository } from "./Repository";
import { RoomError } from "../../middleware/error/roomError";

@Service()
export class RoomInteractor implements IRoomInteractor {
  constructor(private _repository: RoomRepository) { }

  async createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room> {
    const room: Room = await this._repository.create(CreateRoomCreateParams);
    if (!room) { throw RoomError.creationFailed(); }
    return room;
  }

  async getRooms(params: GetRoomsQueryParams): Promise<Room[]> {
    return await this._repository.getRooms(params);
  }

  async getRoom(id: string): Promise<Room> {
    const room: Room | null = await this._repository.getRoom(id);
    if (!room) { throw RoomError.notFound(); }
    return room;
  }

  async deleteRoom(id: string): Promise<void> {
    const room = await this._repository.getRoom(id);
    if (!room) { throw RoomError.notFound(); }
    await this._repository.deleteRoom(id);
  }
}
