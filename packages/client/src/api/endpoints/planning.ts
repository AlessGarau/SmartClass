import { apiClient } from '../client';

export const planningApi = {
    downloadTemplate: async (): Promise<Blob> => {
        const response = await apiClient.get('/planning/excel', {
            responseType: 'blob',
        });
        return response.data;
    },
}