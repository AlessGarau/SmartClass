import type { TeacherCreate, TeacherFilters, TeacherUpdate } from '../../types/Teacher';
import { apiClient } from '../client';

export const teacherApi = {
    getTeachers: async (filters: TeacherFilters = {}) => {
        const response = await apiClient.get('/teacher', { params: filters });
        return response.data;
    },

    getTeachersCount: async (filters: TeacherFilters = {}) => {
        const response = await apiClient.get('/teacher/count', { params: filters });
        return response.data;
    },

    createTeacher: async (data: TeacherCreate) => {
        const response = await apiClient.post('/teacher', data);
        return response.data;
    },

    updateTeacher: async (id: string, data: TeacherUpdate) => {
        const response = await apiClient.put(`/teacher/${id}`, data);
        return response.data;
    },

    deleteTeacher: async (id: string) => {
        const response = await apiClient.delete(`/teacher/${id}`);
        return response.data;
    },
};
