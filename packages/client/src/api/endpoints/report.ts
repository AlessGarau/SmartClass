import type { Report, ReportFilters } from "../../types/Reports";
import { apiClient } from "../client";

export const reportApi = {
    getReportsCount: async (
        filters: ReportFilters = {}
    ): Promise<{ data: { count: number } }> => {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.equipmentType) params.append("equipmentType", String(filters.equipmentType));
        if (filters.roomName) params.append("roomName", String(filters.roomName));
        const response = await apiClient.get(
            `/reporting/count?${params.toString()}`
        );
        return response.data;
    },

    createReport: async (data: {
        equipmentId: string;
        description: string;
    }): Promise<void> => {
        await apiClient.post(`/reporting`, data);
    },

    getReports: async (filters: ReportFilters = {}): Promise<{ data: Report[] }> => {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.equipmentType) params.append("equipmentType", String(filters.equipmentType));
        if (filters.roomName) params.append("roomName", String(filters.roomName));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.offset) params.append("offset", String(filters.offset));
        const response = await apiClient.get(
            `/reporting?${params.toString()}`
        );
        return response.data;
    },

    deleteReport: async (reportId: string): Promise<void> => {
        await apiClient.delete(`/reporting/${reportId}`);
    },

    updateReport: async (
        reportId: string,
        data: {
            status: string;
        }
    ): Promise<void> => {
        await apiClient.patch(`/reporting/${reportId}`, data);
    },
};
