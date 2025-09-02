export interface ReportFilters {
    status?: string;
    equipmentType?: string;
    roomName?: string;
    limit?: number;
    offset?: number;
}

export interface Report {
    id: string;
    equipmentId: string;
    status: string;
    description: string;
    createdDate: Date;
    equipmentType: string;
    roomName: string;
}