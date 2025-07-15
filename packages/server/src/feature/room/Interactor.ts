import { Service } from "typedi";
import { RoomError } from "../../middleware/error/roomError";
import { IRoomInteractor } from "./interface/IInteractor";
import { RoomRepository } from "./Repository";
import { CreateRoomParams, GetRoomsQueryParams, PutRoomParams, Room } from "./validate";

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

  async putRoom(id: string, putRoomParams: PutRoomParams): Promise<Room> {
    const existingRoom: Room | null = await this._repository.getRoom(id);
    if (!existingRoom) { throw RoomError.notFound(); }
    const updatedRoom: Room = await this._repository.putRoom(id, putRoomParams);
    if (!updatedRoom) { throw RoomError.updateFailed(); }
    return updatedRoom;
  }

  async patchRoom(id: string, patchRoomParams: Partial<PutRoomParams>): Promise<Room> {
    const existingRoom: Room | null = await this._repository.getRoom(id);
    if (!existingRoom) { throw RoomError.notFound(); }
    const updatedRoom: Room = await this._repository.patchRoom(id, patchRoomParams);
    if (!updatedRoom) { throw RoomError.updateFailed(); }
    return updatedRoom;
  }

  async deleteRoom(id: string): Promise<void> {
    const room = await this._repository.getRoom(id);
    if (!room) { throw RoomError.notFound(); }
    await this._repository.deleteRoom(id);
  }
}
