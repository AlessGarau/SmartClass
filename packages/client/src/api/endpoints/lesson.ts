import { apiClient } from '../client';
import type { PlannedClass } from '../../types/Planning';

export const lessonApi = {
    updateLesson: async (lesson: PlannedClass): Promise<{ message: string; data: PlannedClass }> => {
        const response = await apiClient.put(`/lesson/${lesson.id}`, lesson);
        return response.data;
    },

    deleteLesson: async (lessonId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/lesson/${lessonId}`);
        return response.data;
    },
};