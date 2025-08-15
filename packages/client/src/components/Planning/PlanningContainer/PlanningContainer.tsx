import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfISOWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getTimeSlotsForDay } from "../../../utils/planning";
import type { Classroom, WeekDate, PlanningFilters, PlannedClass } from "../../../types/Planning";
import PlannedClassSlot from "../PlannedClassSlot/PlannedClassSlot";
import { planningQueryOptions } from "../../../api/queryOptions";
import LessonDetailsModal from "../LessonDetailsModal/LessonDetailsModal";

interface PlanningContainerProps {
    startDate: string;
    endDate: string;
    year: number;
    buildingFilter?: string;
    floorFilter?: number;
}

const PlanningContainer: React.FC<PlanningContainerProps> = ({
    startDate,
    endDate,
    year,
    buildingFilter,
    floorFilter
}) => {
    const [currentWeek, setCurrentWeek] = useState<WeekDate[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<PlannedClass | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filters: PlanningFilters = {
        startDate,
        endDate,
        year,
        building: buildingFilter,
        floor: floorFilter
    };

    const { data: planningResponse, isLoading, error } = useQuery({
        ...planningQueryOptions.weeklyPlanning(filters),
    });

    const weekPlanningData = planningResponse?.data || null;

    useEffect(() => {
        const start = new Date(startDate);
        const monday = startOfISOWeek(start);

        const weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
        const weekDates = weekDays.map((day, i) => {
            const date = addDays(monday, i);
            return {
                day,
                date: format(date, 'dd/MM', { locale: fr }),
                fullDate: date
            };
        });

        setCurrentWeek(weekDates);
    }, [startDate]);

    if (error) {
        console.error('Error loading week planning:', error);
    }

    const getClassesForDay = (classroom: Classroom, dayOfWeek: string) => {
        return classroom.plannedClasses.filter(cls => cls.dayOfWeek === dayOfWeek);
    };

    const handleLessonClick = (lesson: PlannedClass) => {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedLesson(null);
    };

    return (
        <div className="w-full">

            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="text-gray-500">Chargement...</div>
                </div>
            ) : (
                <table className="flex flex-col justify-between items-center rounded-md bg-white border border-grayBorder border-solid border-2">
                    <thead className="flex flex-col gap-2 bg-lightGray w-full rounded-t-md p-4 font-semibold text-[12px]">
                        <tr className="w-full flex justify-between items-center">
                            <th className="flex-1">CLASSE</th>
                            {currentWeek.map((day) => (
                                <th key={day.day} className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div>{day.day}</div>
                                        <div>{day.date}</div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {weekPlanningData?.classrooms.map((classroom) => (
                            <tr key={classroom.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                                <td className="flex-1 font-medium">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{classroom.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {classroom.building} - Étage {classroom.floor} ({classroom.capacity} places)
                                        </span>
                                    </div>
                                </td>
                                {currentWeek.map((day) => {
                                    const plannedClasses = getClassesForDay(classroom, day.day);
                                    const timeSlots = getTimeSlotsForDay(plannedClasses);
                                    return (
                                        <td key={day.day} className={`flex-1 h-96`}>
                                            <div className="flex flex-col gap-2 h-full">
                                                {timeSlots.map((slot, index) => (
                                                    <PlannedClassSlot
                                                        key={slot.plannedClass ? `${classroom.id}-${day.day}-${slot.plannedClass.id}` : `${classroom.id}-${day.day}-empty-${index}`}
                                                        plannedClass={slot.plannedClass}
                                                        isEmpty={slot.isEmpty}
                                                        startTime={slot.startTime}
                                                        endTime={slot.endTime}
                                                        onClick={slot.plannedClass ? () => handleLessonClick(slot.plannedClass!) : undefined}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedLesson && (
                <LessonDetailsModal
                    lesson={selectedLesson}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
        </div>
    )
};

export default PlanningContainer;