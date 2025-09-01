import type { PlannedClass, PlanningFilters } from "../types/Planning";
import type { LoginCredentials } from "../types/User";
import { lessonApi } from "./endpoints/lesson";
import { planningApi } from "./endpoints/planning";
import { roomApi } from "./endpoints/room";
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

    floorOptions: (building: string) => ({
        queryKey: ["room", "floorOptions", building],
        queryFn: () => roomApi.getFloorOptions(building),
        staleTime: 60 * 60 * 1000,
    }),

    getRooms: (filters = {}) => ({
        queryKey: ["room", "allRooms", filters],
        queryFn: () => roomApi.getRooms(filters),
        staleTime: 60 * 60 * 1000,
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

export const roomQueryOptions = {
    rooms: () => ({
        queryKey: ["room"],
        queryFn: () => roomApi.getRooms(),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    }),
};
