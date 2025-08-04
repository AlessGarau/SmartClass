import { Service } from "typedi";
import { IMapper } from "./interface/IMapper";
import { Count, Room } from "./validate";
@Service()
export class RoomMapper implements IMapper {
  toGetRoomsResponse(rooms: Room[]): Room[] {
    return rooms.map(room => ({
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

  toGetTotalRoomsResponse(total: number): Count {
    return { count: total };
  }
}
