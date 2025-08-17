import { apiClient } from "../client";

export interface Room {
    id: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    isEnabled: boolean;
}

export interface Equipment {
    id: string;
    type: string;
    isFunctional: boolean;
    isRunning: boolean;
    roomId: string;
}

export interface Report {
    reporting: {
        id: string;
        equipmentId: string;
        description: string;
        status: string;
        createdDate: string;
    };
    equipment: Equipment | null;
}

export interface SensorData {
    id: string;
    physicalId: string;
    roomId: string;
}

export interface TemperatureData {
    id: string;
    roomId: string;
    data: string;
    savedAt: string;
    sensorId: string;
}

export interface HumidityData {
    id: string;
    roomId: string;
    data: string;
    savedAt: string;
    sensorId: string;
}

export interface PressureData {
    id: string;
    roomId: string;
    data: string;
    savedAt: string;
    sensorId: string;
}

export interface MovementData {
    id: number;
    roomId: string;
    data: string;
    savedAt: string;
    sensorId: string;
}

export const roomApi = {
    getRoom: async (id: string): Promise<{ data: Room }> => {
        const response = await apiClient.get(`/room/${id}`);
        return response.data;
    },

    getRooms: async (params?: {
        limit?: number;
        offset?: number;
        isEnabled?: boolean;
        search?: string;
        building?: string;
        floor?: number;
    }): Promise<{ data: Room[] }> => {
        const queryParams = new URLSearchParams();

        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.offset)
            queryParams.append("offset", params.offset.toString());
        if (params?.isEnabled !== undefined)
            queryParams.append("isEnabled", params.isEnabled.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.building) queryParams.append("building", params.building);
        if (params?.floor !== undefined)
            queryParams.append("floor", params.floor.toString());

        const queryString = queryParams.toString();
        const url = queryString ? `/room?${queryString}` : "/room";

        const response = await apiClient.get(url);
        return response.data;
    },

    getEquipment: async (
        roomId: string
    ): Promise<{ data: Equipment[]; message: string }> => {
        const response = await apiClient.get(`/equipment/${roomId}`);
        return response.data;
    },

    getReports: async (
        roomId: string
    ): Promise<{ data: Report[]; message: string }> => {
        const response = await apiClient.get(`/reporting/${roomId}`);
        return response.data;
    },

    // API pour récupérer les données de capteurs (si disponibles côté serveur)
    getSensors: async (
        roomId: string
    ): Promise<{ data: SensorData[]; message: string }> => {
        try {
            const response = await apiClient.get(`/sensor/${roomId}`);
            return response.data;
        } catch {
            return { data: [], message: "Capteurs non disponibles" };
        }
    },

    getTemperatureData: async (
        roomId: string
    ): Promise<{ data: TemperatureData[]; message: string }> => {
        try {
            const response = await apiClient.get(`/temperature/${roomId}`);
            return response.data;
        } catch {
            return {
                data: [],
                message: "Données de température non disponibles",
            };
        }
    },

    getHumidityData: async (
        roomId: string
    ): Promise<{ data: HumidityData[]; message: string }> => {
        try {
            const response = await apiClient.get(`/humidity/${roomId}`);
            return response.data;
        } catch {
            return { data: [], message: "Données d'humidité non disponibles" };
        }
    },

    getPressureData: async (
        roomId: string
    ): Promise<{ data: PressureData[]; message: string }> => {
        try {
            const response = await apiClient.get(`/pressure/${roomId}`);
            return response.data;
        } catch {
            return { data: [], message: "Données de pression non disponibles" };
        }
    },

    getMovementData: async (
        roomId: string
    ): Promise<{ data: MovementData[]; message: string }> => {
        try {
            const response = await apiClient.get(`/movement/${roomId}`);
            return response.data;
        } catch {
            return {
                data: [],
                message: "Données de mouvement non disponibles",
            };
        }
    },
};
