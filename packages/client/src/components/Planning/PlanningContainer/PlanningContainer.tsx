import React, { useEffect, useState } from "react";
import { getDatesOfWeek } from "../../../utils/dates";
import { getTimeSlotsForDay } from "../../../utils/planning";
import type { Classroom, WeekPlanningData, WeekDate } from "../../../types/Planning";
import PlannedClassSlot from "../PlannedClassSlot/PlannedClassSlot";
import { getBuildingDisplayName, fetchWeekPlanning } from "../../../api/mockPlanningApi";

interface PlanningContainerProps {
    weekNumber: number;
    year: number;
    buildingFilter?: string;
    floorFilter?: number;
}

const PlanningContainer: React.FC<PlanningContainerProps> = ({
    weekNumber,
    year,
    buildingFilter,
    floorFilter
}) => {
    const [currentWeek, setCurrentWeek] = useState<WeekDate[]>([]);
    const [weekPlanningData, setWeekPlanningData] = useState<WeekPlanningData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setCurrentWeek(getDatesOfWeek(weekNumber, year));
    }, [weekNumber, year]);

    // useEffect will be replaced by tanstack query when server route is ready
    useEffect(() => {
        const loadWeekPlanning = async () => {
            setIsLoading(true);
            try {
                const data = await fetchWeekPlanning(weekNumber, year, buildingFilter, floorFilter);
                setWeekPlanningData(data);
            } catch (error) {
                console.error('Error loading week planning:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWeekPlanning();
    }, [weekNumber, year, buildingFilter, floorFilter]);

    const getClassesForDay = (classroom: Classroom, dayOfWeek: string) => {
        return classroom.plannedClasses.filter(cls => cls.dayOfWeek === dayOfWeek);
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
                                            {getBuildingDisplayName(classroom.building)} - Étage {classroom.floor} ({classroom.capacity} places)
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
                                                        key={`${day.day}-${index}`}
                                                        plannedClass={slot.plannedClass}
                                                        isEmpty={slot.isEmpty}
                                                        startTime={slot.startTime}
                                                        endTime={slot.endTime}
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
        </div>
    )
};

export default PlanningContainer;