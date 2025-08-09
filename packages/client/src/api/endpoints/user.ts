import { apiClient } from '../client';
import type { LoginCredentials, User } from '../../types/User';
import type { FilterOption } from '../../types/Planning';

export const userApi = {
    login: async (credentials: LoginCredentials): Promise<{ data: User }> => {
        const response = await apiClient.post('/user/login', credentials);
        return response.data;
    },

    getMe: async (): Promise<{ data: User }> => {
        const response = await apiClient.get('/user/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/user/logout');
    },

    getTeacherOptions: async (): Promise<{ data: FilterOption[]; message: string }> => {
        const response = await apiClient.get('/user/teachers/options');
        return response.data;
    },
}