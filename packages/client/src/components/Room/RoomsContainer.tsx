import type { Room } from "../../types/Room";
import RoomCard from "./RoomCard";

interface RoomsContainerProps {
    displayedRooms: Room[];
}

const RoomsContainer: React.FC<RoomsContainerProps> = ({ displayedRooms }) => {
    return (
        <div className="w-full overflow-x-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {displayedRooms.map((room) => <RoomCard key={room.id} room={room} />)}
        </div>
    );
};

export default RoomsContainer;