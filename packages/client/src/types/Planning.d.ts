export interface PlannedClass {
    id: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
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
    weekNumber: number;
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