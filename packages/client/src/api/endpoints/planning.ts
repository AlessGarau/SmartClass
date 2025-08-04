import { apiClient } from '../client';
import type { WeekPlanningData, PlanningFilters, PlanningFilterOptions } from '../../types/Planning';

export const planningApi = {
    downloadTemplate: async (): Promise<Blob> => {
        const response = await apiClient.get('/planning/excel', {
            responseType: 'blob'
        });
        return response.data;
    },

    getWeeklyPlanning: async (filters: PlanningFilters): Promise<{ data: WeekPlanningData }> => {
        const queryParams = new URLSearchParams();

        queryParams.append('startDate', filters.startDate);
        queryParams.append('endDate', filters.endDate);
        
        if (filters.year) {
            queryParams.append('year', filters.year.toString());
        }
        if (filters.building) {
            queryParams.append('building', filters.building);
        }
        if (filters.floor !== undefined) {
            queryParams.append('floor', filters.floor.toString());
        }

        const queryString = queryParams.toString();
        const url = `/planning?${queryString}`;

        const response = await apiClient.get(url);
        return response.data;
    },

    uploadLessons: async (file: File): Promise<{ message: string; importedCount: number; skippedCount: number; errors: Array<{ row: number; field?: string; message: string }> }> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/planning/excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getFilterOptions: async (): Promise<{ data: PlanningFilterOptions }> => {
        const response = await apiClient.get('/planning/filters');
        return response.data;
    },
}