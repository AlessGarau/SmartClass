export interface TeacherFilters {
    search?: string;
    limit?: number;
    offset?: number;
}

export interface TeacherCreate {
    email: string,
    firstName: string,
    lastName: string,
}

export interface TeacherUpdate {
    email: string,
    firstName: string,
    lastName: string,
}

export interface Teacher {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
}
