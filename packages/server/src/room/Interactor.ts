import { Service } from "typedi";
import { IRoomInteractor } from "./interface/IInteractor";
import { RoomCreateParams, Room } from "./validate";
import { RoomRepository } from "./Repository";
import { RoomError } from "../error/roomError";

@Service()
export class RoomInteractor implements IRoomInteractor {
  constructor(private repository: RoomRepository) {}

  async createRoom(
    CreateRoomCreateParams: RoomCreateParams,
  ): Promise<Room> {
    const room = await this.repository.create(CreateRoomCreateParams);

    if (!room) {
      throw RoomError.creationFailed();
    }

    return room;
  }

  async getRooms(): Promise<Room[]> {
    const rooms = await this.repository.getRooms();
    return rooms;
  }
}
