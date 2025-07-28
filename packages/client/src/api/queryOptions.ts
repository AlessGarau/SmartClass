import type { LoginCredentials } from "../types/User";
import { userApi } from "./endpoints/user";
import { planningApi } from "./endpoints/planning";

export const userQueryOptions = {
    login: () => ({
        mutationFn: (credentials: LoginCredentials) =>
            userApi.login(credentials),
        mutationKey: ['user', 'login'],
    }),

    me: () => ({
        queryKey: ['user', 'me'],
        queryFn: () => userApi.getMe(),
        staleTime: 5 * 60 * 1000,
        retry: false,
    }),

    logout: () => ({
        mutationFn: () => userApi.logout(),
        mutationKey: ['user', 'logout'],
    })
};

export const planningQueryOptions = {
    downloadTemplate: () => ({
        mutationFn: () => planningApi.downloadTemplate(),
        mutationKey: ['planning', 'downloadTemplate'],
    }),
};