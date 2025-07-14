import { Service } from "typedi";
import { IRoomInteractor } from "./interface/IInteractor";
import { RoomCreateParams, Room, GetRoomsQueryParams } from "./validate";
import { RoomRepository } from "./Repository";
import { RoomError } from "../../middleware/error/roomError";

@Service()
export class RoomInteractor implements IRoomInteractor {
  constructor(private _repository: RoomRepository) { }

  async createRoom(CreateRoomCreateParams: RoomCreateParams): Promise<Room> {
    const room: Room = await this._repository.create(CreateRoomCreateParams);
    if (!room) { throw RoomError.creationFailed(); }
    return room;
  }

  async getRooms(params: GetRoomsQueryParams): Promise<Room[]> {
    return await this._repository.getRooms(params);
  }
}
