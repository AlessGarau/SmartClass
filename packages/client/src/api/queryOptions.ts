import type { LoginCredentials } from "../types/User";
import type { PlanningFilters, PlannedClass } from "../types/Planning";
import { userApi } from "./endpoints/user";
import { planningApi } from "./endpoints/planning";
import { lessonApi } from "./endpoints/lesson";
import { roomApi } from "./endpoints/room";

export const userQueryOptions = {
    login: () => ({
        mutationFn: (credentials: LoginCredentials) =>
            userApi.login(credentials),
        mutationKey: ["user", "login"],
    }),

    me: () => ({
        queryKey: ["user", "me"],
        queryFn: () => userApi.getMe(),
        staleTime: 5 * 60 * 1000,
        retry: false,
    }),

    logout: () => ({
        mutationFn: () => userApi.logout(),
        mutationKey: ["user", "logout"],
    }),

    teacherOptions: () => ({
        queryKey: ["user", "teacherOptions"],
        queryFn: () => userApi.getTeacherOptions(),
        staleTime: 60 * 60 * 1000, // 1 hour
    }),
};

export const roomQueryOptions = {
    room: (id: string) => ({
        queryKey: ["room", id],
        queryFn: () => roomApi.getRoom(id),
        staleTime: 5 * 60 * 1000,
    }),

    rooms: (params?: Parameters<typeof roomApi.getRooms>[0]) => ({
        queryKey: ["rooms", params],
        queryFn: () => roomApi.getRooms(params),
        staleTime: 5 * 60 * 1000,
    }),

    equipment: (roomId: string) => ({
        queryKey: ["room", roomId, "equipment"],
        queryFn: () => roomApi.getEquipment(roomId),
        staleTime: 2 * 60 * 1000, // 2 minutes
    }),

    reports: (roomId: string) => ({
        queryKey: ["room", roomId, "reports"],
        queryFn: () => roomApi.getReports(roomId),
        staleTime: 1 * 60 * 1000, // 1 minute
    }),

    sensors: (roomId: string) => ({
        queryKey: ["room", roomId, "sensors"],
        queryFn: () => roomApi.getSensors(roomId),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    temperatureData: (roomId: string) => ({
        queryKey: ["room", roomId, "temperature"],
        queryFn: () => roomApi.getTemperatureData(roomId),
        staleTime: 1 * 60 * 1000, // 1 minute
    }),

    humidityData: (roomId: string) => ({
        queryKey: ["room", roomId, "humidity"],
        queryFn: () => roomApi.getHumidityData(roomId),
        staleTime: 1 * 60 * 1000, // 1 minute
    }),

    pressureData: (roomId: string) => ({
        queryKey: ["room", roomId, "pressure"],
        queryFn: () => roomApi.getPressureData(roomId),
        staleTime: 1 * 60 * 1000, // 1 minute
    }),

    movementData: (roomId: string) => ({
        queryKey: ["room", roomId, "movement"],
        queryFn: () => roomApi.getMovementData(roomId),
        staleTime: 30 * 1000, // 30 secondes pour les mouvements
    }),

    // Query options pour les données journalières des capteurs (pour graphiques)
    dailyTemperatureData: (roomId: string, date?: string) => ({
        queryKey: ["room", roomId, "daily", "temperature", date || new Date().toISOString().split('T')[0]],
        queryFn: () => roomApi.getDailyTemperatureData(roomId, date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    dailyHumidityData: (roomId: string, date?: string) => ({
        queryKey: ["room", roomId, "daily", "humidity", date || new Date().toISOString().split('T')[0]],
        queryFn: () => roomApi.getDailyHumidityData(roomId, date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    dailyPressureData: (roomId: string, date?: string) => ({
        queryKey: ["room", roomId, "daily", "pressure", date || new Date().toISOString().split('T')[0]],
        queryFn: () => roomApi.getDailyPressureData(roomId, date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    dailyMovementData: (roomId: string, date?: string) => ({
        queryKey: ["room", roomId, "daily", "movement", date || new Date().toISOString().split('T')[0]],
        queryFn: () => roomApi.getDailyMovementData(roomId, date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    allDailySensorData: (roomId: string, date?: string) => ({
        queryKey: ["room", roomId, "daily", "all", date || new Date().toISOString().split('T')[0]],
        queryFn: () => roomApi.getAllDailySensorData(roomId, date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};

export const planningQueryOptions = {
    downloadTemplate: () => ({
        mutationFn: () => planningApi.downloadTemplate(),
        mutationKey: ["planning", "downloadTemplate"],
    }),

    uploadLessons: () => ({
        mutationFn: (file: File) => planningApi.uploadLessons(file),
        mutationKey: ["planning", "uploadLessons"],
    }),

    weeklyPlanning: (filters: PlanningFilters) => ({
        queryKey: ["planning", "weekly", filters],
        queryFn: () => planningApi.getWeeklyPlanning(filters),
        staleTime: 5 * 60 * 1000,
    }),

    filterOptions: () => ({
        queryKey: ["planning", "filterOptions"],
        queryFn: () => planningApi.getFilterOptions(),
        staleTime: 60 * 60 * 1000,
    }),
};

export const lessonQueryOptions = {
    deleteLesson: () => ({
        mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
        mutationKey: ["lesson", "deleteLesson"],
    }),

    updateLesson: () => ({
        mutationFn: (lesson: PlannedClass) => lessonApi.updateLesson(lesson),
        mutationKey: ["lesson", "updateLesson"],
    }),
};
