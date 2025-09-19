export interface PlannedClass {
    id: string;
    title: string;
    className: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
    date: string;
}

export interface Classroom {
    id: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    plannedClasses: PlannedClass[];
}

export interface WeekPlanningData {
    startDate: string;
    endDate: string;
    year: number;
    classrooms: Classroom[];
}

export interface WeekDate {
    day: string;
    date: string;
    fullDate: Date;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    plannedClass?: PlannedClass;
    isEmpty: boolean;
}

export interface DayScheduleConfig {
    dayStart: string;
    dayEnd: string;
}

export interface PlanningFilters {
    startDate: string;
    endDate: string;
    year: number;
    building?: string;
    floor?: number;
}

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface PlanningFilterOptions {
    buildings: FilterOption[];
    floors: FilterOption[];
}