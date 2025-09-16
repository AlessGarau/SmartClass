import type { ClassCreate, ClassFilters, ClassUpdate } from '../../types/Class';
import { apiClient } from '../client';

export const classApi = {
    getClasses: async (filters: ClassFilters = {}) => {
        const response = await apiClient.get('/class', { params: filters });
        return response.data;
    },

    getClassesCount: async (filters: ClassFilters = {}) => {
        const response = await apiClient.get('/class/count', { params: filters });
        return response.data;
    },

    createClass: async (data: ClassCreate) => {
        const response = await apiClient.post('/class', data);
        return response.data;
    },

    updateClass: async (id: string, data: ClassUpdate) => {
        const response = await apiClient.put(`/class/${id}`, data);
        return response.data;
    },

    deleteClass: async (id: string) => {
        const response = await apiClient.delete(`/class/${id}`);
        return response.data;
    },
};
