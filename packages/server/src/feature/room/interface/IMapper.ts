import { Count, Room } from "../validate";

export interface IMapper {
    toGetRoomsResponse(rooms: Room[]): Room[];
    toGetRoomResponse(room: Room): Room;
    toGetTotalRoomsResponse(total: number): Count;
}
