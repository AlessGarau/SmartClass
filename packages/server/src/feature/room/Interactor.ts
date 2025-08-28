import { Service } from "typedi";
import { RoomError } from "../../middleware/error/roomError";
import { IRoomInteractor } from "./interface/IInteractor";
import { RoomRepository } from "./Repository";
import {
  CreateRoomParams,
  GetRoomFilterOptionsParams,
  GetRoomsQueryParams,
  PatchRoomParams,
  PutRoomParams,
  Room,
  RoomFilter,
  RoomFilterOptions,
  RoomWithMetrics,
} from "./validate";

@Service()
export class RoomInteractor implements IRoomInteractor {
  constructor(private _repository: RoomRepository) { }

  private _getBuildingLabel(buildingCode: string): string {
    const regex = /^bat([A-Z0-9]+)$/i;
    const match = regex.exec(buildingCode);
    if (match) {
      return `Bâtiment ${match[1].toUpperCase()}`;
    }
    return buildingCode;
  }

  async createRoom(CreateRoomCreateParams: CreateRoomParams): Promise<Room> {
    const room: Room = await this._repository.create(CreateRoomCreateParams);
    if (!room) {
      throw RoomError.creationFailed();
    }
    return room;
  }

  async getRooms(params: GetRoomsQueryParams): Promise<RoomWithMetrics[]> {
    return this._repository.getRooms(params);
  }

  async getRoomFilterOptions(params: GetRoomFilterOptionsParams): Promise<RoomFilterOptions> {
    const distinctBuildings = params.building ? await this._repository.getDistinctBuildings() : [];
    const distinctFloors = params.floor ? await this._repository.getDistinctFloorsByBuilding(params.floor) : [];

    const buildings = distinctBuildings.map(building => ({
      value: building,
      label: this._getBuildingLabel(building),
    }));

    const floors = distinctFloors.map(floor => ({
      value: floor,
      label: `Étage ${floor}`,
    }));

    return {
      buildings,
      floors,
    };
  }

  async getRoomsCount(params: RoomFilter): Promise<number> {
    return this._repository.getRoomsCount(params);
  }

  async getRoom(id: string): Promise<RoomWithMetrics> {
    const room = await this._repository.getRoom(id);
    if (!room) {
      throw RoomError.notFound(`Room with ID "${id}" not found.`);
    }
    return room;
  }

  async putRoom(id: string, putRoomParams: PutRoomParams): Promise<Room> {
    const existingRoom: Room | null = await this._repository.getRoom(id);
    if (!existingRoom) {
      throw RoomError.notFound(`Room with ID "${id}" not found.`);
    }
    const updatedRoom: Room = await this._repository.putRoom(id, putRoomParams);
    if (!updatedRoom) {
      throw RoomError.updateFailed();
    }
    return updatedRoom;
  }

  async patchRoom(id: string, patchRoomParams: PatchRoomParams): Promise<Room> {
    const existingRoom: Room | null = await this._repository.getRoom(id);
    if (!existingRoom) {
      throw RoomError.notFound(`Room with ID "${id}" not found.`);
    }
    const updatedRoom: Room = await this._repository.patchRoom(
      id,
      patchRoomParams,
    );
    if (!updatedRoom) {
      throw RoomError.updateFailed();
    }
    return updatedRoom;
  }

  async deleteRoom(id: string): Promise<void> {
    const room = await this._repository.getRoom(id);
    if (!room) {
      throw RoomError.notFound(`Room with ID "${id}" not found.`);
    }
    await this._repository.deleteRoom(id);
  }
}
