import type { LoginCredentials } from "../types/User";
import type { PlanningFilters, PlannedClass } from "../types/Planning";
import { userApi } from "./endpoints/user";
import { planningApi } from "./endpoints/planning";
import { lessonApi } from "./endpoints/lesson";
import { sensorApi } from "./endpoints/sensor";

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

export const sensorQueryOptions = {
    dailySensorData: (roomId: string) => ({
        queryKey: ["sensor", "daily", roomId],
        queryFn: () => sensorApi.getDailySensorData(roomId),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30 * 1000,
    }),
};
