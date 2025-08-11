import { apiClient } from "../client";

export interface Room {
    id: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    isEnabled: boolean;
}

export interface RoomWithStatus extends Room {
    temperature?: number;
    humidity?: number;
    status: "optimal" | "alert" | "inactive";
    occupancy?: number;
}

export interface RoomResponse {
    data: Room[];
    message?: string;
}

export interface RoomStatusResponse {
    data: RoomWithStatus[];
    message?: string;
}

export const roomApi = {
    getRooms: async (): Promise<RoomResponse> => {
        const response = await apiClient.get("/room");
        return response.data;
    },

    getRoomsWithStatus: async (): Promise<RoomStatusResponse> => {
        const response = await apiClient.get("/room");
        // Mocking room status data
        const roomsWithStatus =
            response.data.data?.map((room: Room) => ({
                ...room,
                temperature: Math.round(20 + Math.random() * 5),
                humidity: Math.round(40 + Math.random() * 20),
                occupancy: Math.floor(Math.random() * room.capacity),
                status:
                    Math.random() > 0.7
                        ? "alert"
                        : ("optimal" as "optimal" | "alert"),
            })) || [];

        return {
            data: roomsWithStatus,
            message: response.data.message,
        };
    },
};
