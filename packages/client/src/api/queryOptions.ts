import type { LoginCredentials } from "../types/User";
import { userApi } from "./endpoints/user";

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