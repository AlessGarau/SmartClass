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
      is_enabled: room.is_enabled,
    }));
  }

  toGetRoomResponse(room: Room): Room {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      is_enabled: room.is_enabled,
    };
  }

  toGetTotalRoomsResponse(total: number): Count {
    return { count: total };
  }
}
