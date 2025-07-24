import { PLANNING_CONFIG } from '../constants/planning';
import type { DayScheduleConfig, PlannedClass, TimeSlot } from '../types/Planning';

const DEFAULT_DAY_SCHEDULE: DayScheduleConfig = {
    dayStart: PLANNING_CONFIG.DAY_START_TIME,
    dayEnd: PLANNING_CONFIG.DAY_END_TIME
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

export const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return (endTotalMinutes - startTotalMinutes);
};