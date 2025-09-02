import type { PlannedClass, PlanningFilters } from "../types/Planning";
import type { LoginCredentials } from "../types/User";
import { lessonApi } from "./endpoints/lesson";
import { planningApi } from "./endpoints/planning";
import { reportApi } from "./endpoints/report";
import { roomApi } from "./endpoints/room";
import { sensorApi } from "./endpoints/sensor";
import { userApi } from "./endpoints/user";
import { weatherApi } from "./endpoints/weather";

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

export const roomQueryOptions = {
    roomCount: (filters = {}) => ({
        queryKey: ["room", "count", filters],
        queryFn: () => roomApi.getRoomsCount(filters),
        staleTime: 60 * 60 * 1000,
    }),

    rooms: () => ({
        queryKey: ["room", "withStatus"],
        queryFn: () => roomApi.getRooms(),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    }),

    buildingOptions: () => ({
        queryKey: ["room", "buildingOptions"],
        queryFn: () => roomApi.getBuildingOptions(),
        staleTime: 60 * 60 * 1000,
    }),

    roomNameOptions: () => ({
        queryKey: ["room", "nameOptions"],
        queryFn: () => roomApi.getRoomNameOptions(),
        staleTime: 60 * 60 * 1000,
    }),

    floorOptions: (building: string) => ({
        queryKey: ["room", "floorOptions", building],
        queryFn: () => roomApi.getFloorOptions(building),
        staleTime: 60 * 60 * 1000,
    }),

    getRooms: (filters = {}) => ({
        queryKey: ["room", "allRooms", filters],
        queryFn: async () => {
            const response = await roomApi.getRooms(filters);
            return {
                ...response,
                data: response.data.map((room) => ({
                    ...room,
                    humidity:
                        room.humidity !== null ? Number(room.humidity) : null,
                    temperature:
                        room.temperature !== null
                            ? Number(room.temperature)
                            : null,
                    pressure:
                        room.pressure !== null ? Number(room.pressure) : null,
                    movement:
                        room.movement !== null ? Number(room.movement) : null,
                })),
            };
        },
        staleTime: 60 * 60 * 1000,
    }),

    getRoom: (roomId: string) => ({
        queryKey: ["room", roomId],
        queryFn: async () => {
            const response = await roomApi.getRoom(roomId);
            return {
                ...response,
                data: {
                    ...response.data,
                    humidity:
                        response.data.humidity !== null
                            ? Number(response.data.humidity)
                            : null,
                    temperature:
                        response.data.temperature !== null
                            ? Number(response.data.temperature)
                            : null,
                    pressure:
                        response.data.pressure !== null
                            ? Number(response.data.pressure)
                            : null,
                    movement:
                        response.data.movement !== null
                            ? Number(response.data.movement)
                            : null,
                },
            };
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    }),

    deleteRoom: () => ({
        mutationKey: ["room", "deleteRoom"],
        mutationFn: (roomId: string) => roomApi.deleteRoom(roomId),
    }),

    updateRoom: () => ({
        mutationKey: ["room", "updateRoom"],
        mutationFn: ({
            roomId,
            data,
        }: {
            roomId: string;
            data: {
                name: string;
                building: string;
                floor: number;
                capacity: number;
            };
        }) => roomApi.updateRoom(roomId, data),
    }),

    createRoom: () => ({
        mutationKey: ["room", "createRoom"],
        mutationFn: (data: {
            name: string;
            building: string;
            floor: number;
            capacity: number;
        }) => roomApi.createRoom(data),
    }),
};

export const reportQueryOptions = {
    reportCount: (filters = {}) => ({
        queryKey: ["report", "count", filters],
        queryFn: () => reportApi.getReportsCount(filters),
        staleTime: 60 * 60 * 1000,
    }),

    createReport: () => ({
        mutationKey: ["report", "createReport"],
        mutationFn: (data: {
            equipmentId: string;
            description: string;
        }) => reportApi.createReport(data),
    }),

    getReports: (filters = {}) => ({
        queryKey: ["report", "allReports", filters],
        queryFn: async () => {
            const response = await reportApi.getReports(filters);
            return response;
        },
        staleTime: 60 * 60 * 1000,
    }),

    deleteReport: () => ({
        mutationKey: ["report", "deleteReport"],
        mutationFn: (reportId: string) => reportApi.deleteReport(reportId),
    }),

    updateReport: () => ({
        mutationKey: ["report", "updateReport"],
        mutationFn: ({
            reportId,
            data,
        }: {
            reportId: string;
            data: {
                status: string;
            };
        }) => reportApi.updateReport(reportId, data),
    }),
}

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

export const weatherQueryOptions = {
    weeklyWeather: () => ({
        queryKey: ["weather", "weekly"],
        queryFn: () => weatherApi.getWeeklyWeather(),
        staleTime: 10 * 60 * 1000,
        refetchInterval: 30 * 60 * 1000,
    }),
};

export const sensorQueryOptions = {
    dailySensorData: (roomId: string) => ({
        queryKey: ["sensor", "daily", roomId],
        queryFn: () => sensorApi.getDailySensorData(roomId),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // 5 minutes
        enabled: !!roomId,
    }),
};
