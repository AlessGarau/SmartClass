import { Service } from "typedi";
import { IRoomInteractor } from "./interface/IInteractor";
import { RoomCreateParams, Room } from "./validate";
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

  async getRooms(): Promise<Room[]> {
    const rooms = await this._repository.getRooms();
    return rooms;
  }
}
