interface PlannedClass {
    id: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: string;
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

const DEFAULT_DAY_SCHEDULE: DayScheduleConfig = {
    dayStart: "09:00",
    dayEnd: "17:00"
};

export const getTimeSlotsForDay = (
    plannedClasses: PlannedClass[],
    config: DayScheduleConfig = DEFAULT_DAY_SCHEDULE
): TimeSlot[] => {
    const { dayStart, dayEnd } = config;

    if (plannedClasses.length === 0) {
        return [{
            startTime: dayStart,
            endTime: dayEnd,
            isEmpty: true
        }];
    }

    const sortedClasses = plannedClasses.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
    );

    const timeSlots: TimeSlot[] = [];

    if (sortedClasses[0].startTime > dayStart) {
        timeSlots.push({
            startTime: dayStart,
            endTime: sortedClasses[0].startTime,
            isEmpty: true
        });
    }

    sortedClasses.forEach((plannedClass, index) => {
        timeSlots.push({
            startTime: plannedClass.startTime,
            endTime: plannedClass.endTime,
            plannedClass: plannedClass,
            isEmpty: false
        });

        if (index < sortedClasses.length - 1) {
            const nextClass = sortedClasses[index + 1];
            if (plannedClass.endTime < nextClass.startTime) {
                timeSlots.push({
                    startTime: plannedClass.endTime,
                    endTime: nextClass.startTime,
                    isEmpty: true
                });
            }
        }
    });

    const lastClass = sortedClasses[sortedClasses.length - 1];
    if (lastClass.endTime < dayEnd) {
        timeSlots.push({
            startTime: lastClass.endTime,
            endTime: dayEnd,
            isEmpty: true
        });
    }

    return timeSlots;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
};

export const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return (endTotalMinutes - startTotalMinutes);
};

export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins}min`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h${mins}min`;
    }
};