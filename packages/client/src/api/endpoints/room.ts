import type { Room, RoomFilterOptions, RoomFilters } from "../../types/Room";
import { apiClient } from "../client";

export const roomApi = {
    getRoomsCount: async (
        filters: RoomFilters = {}
    ): Promise<{ data: { count: number } }> => {
        const params = new URLSearchParams();
        if (filters.building) params.append("building", filters.building);
        if (filters.floor !== undefined)
            params.append("floor", String(filters.floor));
        if (filters.isEnabled !== undefined)
            params.append("isEnabled", String(filters.isEnabled));
        if (filters.search) params.append("search", filters.search);
        const response = await apiClient.get(
            `/room/count?${params.toString()}`
        );
        return response.data;
    },

    getBuildingOptions: async (): Promise<{ data: RoomFilterOptions }> => {
        const response = await apiClient.get("/room/filters?building=true");
        return response.data;
    },

    getFloorOptions: async (
        building: string
    ): Promise<{ data: RoomFilterOptions }> => {
        const response = await apiClient.get(`/room/filters?floor=${building}`);
        return response.data;
    },

    getRooms: async (filters: RoomFilters = {}): Promise<{ data: Room[] }> => {
        const params = new URLSearchParams();
        if (filters.building) params.append("building", filters.building);
        if (filters.floor !== undefined)
            params.append("floor", String(filters.floor));
        if (filters.isEnabled !== undefined)
            params.append("isEnabled", String(filters.isEnabled));
        if (filters.search) params.append("search", filters.search);
        if (filters.limit !== undefined)
            params.append("limit", String(filters.limit));
        if (filters.offset !== undefined)
            params.append("offset", String(filters.offset));
        const response = await apiClient.get(`/room?${params.toString()}`);
        return response.data;
    },

    deleteRoom: async (roomId: string): Promise<void> => {
        await apiClient.delete(`/room/${roomId}`);
    },

    updateRoom: async (
        roomId: string,
        data: {
            name: string;
            building: string;
            floor: number;
            capacity: number;
        }
    ): Promise<void> => {
        await apiClient.patch(`/room/${roomId}`, data);
    },

    createRoom: async (data: {
        name: string;
        building: string;
        floor: number;
        capacity: number;
    }): Promise<void> => {
        await apiClient.post(`/room`, data);
    },
};
