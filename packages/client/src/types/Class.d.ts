export interface ClassFilters {
    search?: string;
    limit?: number;
    offset?: number;
}

export interface ClassCreate {
    name: string;
    studentCount: number;
}

export interface ClassUpdate {
    name: string;
    studentCount: number;
}

export interface Class {
    id: string;
    name: string;
    studentCount: number;
}
