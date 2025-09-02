import { Service } from "typedi";
import { IMapper } from "./interface/IMapper";
import { Count, Room, RoomFilterOptions, RoomWithMetrics } from "./validate";
@Service()
export class RoomMapper implements IMapper {
  toGetRoomsResponse(rooms: Room[]): Room[] {
    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      isEnabled: room.isEnabled,
    }));
  }

  toGetRoomResponse(room: Room): Room {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      isEnabled: room.isEnabled,
    };
  }

  toGetAllRoomsWithMetricsResponse(
    rooms: RoomWithMetrics[],
  ): RoomWithMetrics[] {
    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      isEnabled: room.isEnabled,
      temperature: room.temperature,
      humidity: room.humidity,
      pressure: room.pressure,
      movement: room.movement,
    }));
  }

  toGetRoomWithMetricsResponse(room: RoomWithMetrics): RoomWithMetrics {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      isEnabled: room.isEnabled,
      temperature: room.temperature,
      humidity: room.humidity,
      pressure: room.pressure,
      movement: room.movement,
    };
  }

  toGetTotalRoomsResponse(total: number): Count {
    return { count: total };
  }

  toGetRoomFilterOptionsResponse(filterOptions: RoomFilterOptions): RoomFilterOptions {
    return {
      buildings: filterOptions.buildings,
      names: filterOptions.names,
      floors: filterOptions.floors,
    };
  }
}
