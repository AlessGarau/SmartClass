import { apiClient } from '../client';
import type { WeekPlanningData, PlanningFilters } from '../../types/Planning';

export const planningApi = {
    downloadTemplate: async (): Promise<Blob> => {
        const response = await apiClient.get('/planning/excel');
        return response.data;
    },
    
    getWeeklyPlanning: async (filters: PlanningFilters): Promise<{ data: WeekPlanningData }> => {
        const queryParams = new URLSearchParams();
        
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
        const url = `/planning/${filters.weekNumber}${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiClient.get(url);
        return response.data;
    },
}