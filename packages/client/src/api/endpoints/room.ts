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

// Contrat d'interface pour les données des capteurs de la journée (pour graphiques)
export interface DailySensorData {
    roomId: string;
    date: string; // Format: "2025-08-17"
    sensorType: "temperature" | "humidity" | "pressure" | "movement";
    unit: string; // "°C", "%", "hPa", "boolean"
    data: Array<{
        timestamp: string; // ISO string, ex: "2025-08-17T14:30:00.000Z"
        value: number; // Valeur numérique du capteur
    }>; // Données triées par timestamp croissant
}

export interface DailySensorResponse {
    success: boolean;
    data: DailySensorData;
    message: string;
}

// Fonction mock pour générer des données de capteurs pour la journée
const generateMockDailySensorData = (
    roomId: string,
    sensorType: "temperature" | "humidity" | "pressure" | "movement",
    date: string = new Date().toISOString().split("T")[0]
): DailySensorData => {
    const dataPoints: Array<{ timestamp: string; value: number }> = [];
    const startOfDay = new Date(date);
    let unit: string;

    // Définir l'unité selon le type de capteur
    switch (sensorType) {
        case "temperature":
            unit = "°C";
            break;
        case "humidity":
            unit = "%";
            break;
        case "pressure":
            unit = "hPa";
            break;
        case "movement":
            unit = "boolean";
            break;
        default:
            unit = "";
    }

    // Générer des points de données toutes les 15 minutes (96 points par jour)
    for (let i = 0; i < 96; i++) {
        const timestamp = new Date(startOfDay.getTime() + i * 15 * 60 * 1000);

        let value: number;

        switch (sensorType) {
            case "temperature":
                // Température entre 18°C et 26°C avec variations
                value = 20 + Math.sin(i / 15) * 3 + (Math.random() - 0.5) * 2;
                break;
            case "humidity":
                // Humidité entre 40% et 70%
                value = 55 + Math.sin(i / 20) * 10 + (Math.random() - 0.5) * 10;
                break;
            case "pressure":
                // Pression atmosphérique entre 1010 et 1030 hPa
                value = 1020 + Math.sin(i / 30) * 8 + (Math.random() - 0.5) * 4;
                break;
            case "movement":
                // Mouvement aléatoire (0 ou 1)
                value = Math.random() > 0.8 ? 1 : 0;
                break;
            default:
                value = 0;
        }

        dataPoints.push({
            timestamp: timestamp.toISOString(),
            value: Math.round(value * 100) / 100, // Arrondir à 2 décimales
        });
    }


    return {
        roomId,
        date,
        sensorType,
        unit,
        data: dataPoints,
    };
};

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

    // API MOCK pour les données journalières des capteurs (pour graphiques)
    // Ces endpoints seront à implémenter côté serveur selon le contrat d'interface défini ci-dessus

    getDailyTemperatureData: async (
        roomId: string,
        date?: string
    ): Promise<DailySensorResponse> => {
        // Mock temporaire - à remplacer par un vrai appel API
        try {
            // const response = await apiClient.get(`/sensors/daily/temperature/${roomId}?date=${date || new Date().toISOString().split('T')[0]}`);
            // return response.data;

            // Mock pour le développement
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
            const data = generateMockDailySensorData(
                roomId,
                "temperature",
                date
            );
            return {
                success: true,
                data,
                message:
                    "Données de température journalières récupérées (MOCK)",
            };
        } catch {
            return {
                success: false,
                data: generateMockDailySensorData(roomId, "temperature", date),
                message:
                    "Erreur lors de la récupération des données de température (utilisation du mock)",
            };
        }
    },

    getDailyHumidityData: async (
        roomId: string,
        date?: string
    ): Promise<DailySensorResponse> => {
        try {
            // const response = await apiClient.get(`/sensors/daily/humidity/${roomId}?date=${date || new Date().toISOString().split('T')[0]}`);
            // return response.data;

            // Mock pour le développement
            await new Promise((resolve) => setTimeout(resolve, 500));
            const data = generateMockDailySensorData(roomId, "humidity", date);
            return {
                success: true,
                data,
                message: "Données d'humidité journalières récupérées (MOCK)",
            };
        } catch {
            return {
                success: false,
                data: generateMockDailySensorData(roomId, "humidity", date),
                message:
                    "Erreur lors de la récupération des données d'humidité (utilisation du mock)",
            };
        }
    },

    getDailyPressureData: async (
        roomId: string,
        date?: string
    ): Promise<DailySensorResponse> => {
        try {
            // const response = await apiClient.get(`/sensors/daily/pressure/${roomId}?date=${date || new Date().toISOString().split('T')[0]}`);
            // return response.data;

            // Mock pour le développement
            await new Promise((resolve) => setTimeout(resolve, 500));
            const data = generateMockDailySensorData(roomId, "pressure", date);
            return {
                success: true,
                data,
                message: "Données de pression journalières récupérées (MOCK)",
            };
        } catch {
            return {
                success: false,
                data: generateMockDailySensorData(roomId, "pressure", date),
                message:
                    "Erreur lors de la récupération des données de pression (utilisation du mock)",
            };
        }
    },

    getDailyMovementData: async (
        roomId: string,
        date?: string
    ): Promise<DailySensorResponse> => {
        try {
            // const response = await apiClient.get(`/sensors/daily/movement/${roomId}?date=${date || new Date().toISOString().split('T')[0]}`);
            // return response.data;

            // Mock pour le développement
            await new Promise((resolve) => setTimeout(resolve, 500));
            const data = generateMockDailySensorData(roomId, "movement", date);
            return {
                success: true,
                data,
                message: "Données de mouvement journalières récupérées (MOCK)",
            };
        } catch {
            return {
                success: false,
                data: generateMockDailySensorData(roomId, "movement", date),
                message:
                    "Erreur lors de la récupération des données de mouvement (utilisation du mock)",
            };
        }
    },

    // Fonction utilitaire pour récupérer toutes les données de capteurs d'une journée
    getAllDailySensorData: async (
        roomId: string,
        date?: string
    ): Promise<{
        success: boolean;
        data: {
            temperature: DailySensorData;
            humidity: DailySensorData;
            pressure: DailySensorData;
            movement: DailySensorData;
        };
        message: string;
    }> => {
        try {
            const targetDate = date || new Date().toISOString().split("T")[0];

            const [temperature, humidity, pressure, movement] =
                await Promise.all([
                    roomApi.getDailyTemperatureData(roomId, targetDate),
                    roomApi.getDailyHumidityData(roomId, targetDate),
                    roomApi.getDailyPressureData(roomId, targetDate),
                    roomApi.getDailyMovementData(roomId, targetDate),
                ]);

            return {
                success: true,
                data: {
                    temperature: temperature.data,
                    humidity: humidity.data,
                    pressure: pressure.data,
                    movement: movement.data,
                },
                message:
                    "Toutes les données de capteurs journalières récupérées",
            };
        } catch (error) {
            return {
                success: false,
                data: {
                    temperature: generateMockDailySensorData(
                        roomId,
                        "temperature",
                        date
                    ),
                    humidity: generateMockDailySensorData(
                        roomId,
                        "humidity",
                        date
                    ),
                    pressure: generateMockDailySensorData(
                        roomId,
                        "pressure",
                        date
                    ),
                    movement: generateMockDailySensorData(
                        roomId,
                        "movement",
                        date
                    ),
                },
                message: `Erreur lors de la récupération des données: ${
                    error instanceof Error ? error.message : "Erreur inconnue"
                }`,
            };
        }
    },
};
