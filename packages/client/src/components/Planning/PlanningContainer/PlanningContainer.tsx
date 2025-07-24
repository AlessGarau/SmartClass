import React, { useEffect, useState } from "react";
import { getCurrentWeekNumber, getDatesOfWeek } from "../../../utils/dates";
import { getTimeSlotsForDay } from "../../../utils/planning";
import WeekSelector from "../WeekSelector/WeekSelector";
import PlannedClassSlot from "../PlannedClassSlot/PlannedClassSlot";

// Types for the mock data
interface PlannedClass {
    id: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
}

interface Classroom {
    id: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    plannedClasses: PlannedClass[];
}

interface WeekPlanningData {
    weekNumber: number;
    year: number;
    classrooms: Classroom[];
}

// Mock data
const mockWeekPlanningData: WeekPlanningData = {
    weekNumber: 1,
    year: 2024,
    classrooms: [
        {
            id: "classroom-1",
            name: "Salle 101",
            capacity: 30,
            building: "Bâtiment A",
            floor: 1,
            plannedClasses: [
                {
                    id: "class-1",
                    subject: "Mathématiques",
                    teacher: "Prof. Dupont",
                    startTime: "09:00",
                    endTime: "11:00",
                    room: "Salle 101",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-1b",
                    subject: "Algèbre",
                    teacher: "Prof. Dupont",
                    startTime: "14:00",
                    endTime: "16:00",
                    room: "Salle 101",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-2",
                    subject: "Physique",
                    teacher: "Prof. Martin",
                    startTime: "10:00",
                    endTime: "12:00",
                    room: "Salle 101",
                    dayOfWeek: "MAR"
                },
                {
                    id: "class-2b",
                    subject: "TP Physique",
                    teacher: "Prof. Martin",
                    startTime: "14:00",
                    endTime: "17:00",
                    room: "Salle 101",
                    dayOfWeek: "MAR"
                },
                {
                    id: "class-3",
                    subject: "Informatique",
                    teacher: "Prof. Bernard",
                    startTime: "10:00",
                    endTime: "12:00",
                    room: "Salle 101",
                    dayOfWeek: "JEU"
                }
            ]
        },
        {
            id: "classroom-2",
            name: "Salle 102",
            capacity: 25,
            building: "Bâtiment A",
            floor: 1,
            plannedClasses: [
                {
                    id: "class-4",
                    subject: "Anglais",
                    teacher: "Prof. Wilson",
                    startTime: "09:00",
                    endTime: "11:00",
                    room: "Salle 102",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-4b",
                    subject: "Conversation Anglaise",
                    teacher: "Prof. Wilson",
                    startTime: "13:00",
                    endTime: "15:00",
                    room: "Salle 102",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-5",
                    subject: "Histoire",
                    teacher: "Prof. Rousseau",
                    startTime: "09:00",
                    endTime: "11:00",
                    room: "Salle 102",
                    dayOfWeek: "MER"
                },
                {
                    id: "class-5b",
                    subject: "Histoire Moderne",
                    teacher: "Prof. Rousseau",
                    startTime: "14:00",
                    endTime: "16:00",
                    room: "Salle 102",
                    dayOfWeek: "MER"
                },
                {
                    id: "class-6",
                    subject: "Géographie",
                    teacher: "Prof. Dubois",
                    startTime: "16:00",
                    endTime: "18:00",
                    room: "Salle 102",
                    dayOfWeek: "VEN"
                }
            ]
        },
        {
            id: "classroom-3",
            name: "Labo Informatique",
            capacity: 20,
            building: "Bâtiment B",
            floor: 2,
            plannedClasses: [
                {
                    id: "class-7",
                    subject: "Programmation",
                    teacher: "Prof. Garcia",
                    startTime: "09:00",
                    endTime: "12:00",
                    room: "Labo Informatique",
                    dayOfWeek: "MAR"
                },
                {
                    id: "class-7b",
                    subject: "Algorithmes",
                    teacher: "Prof. Garcia",
                    startTime: "14:00",
                    endTime: "16:00",
                    room: "Labo Informatique",
                    dayOfWeek: "MAR"
                },
                {
                    id: "class-8",
                    subject: "Base de données",
                    teacher: "Prof. Garcia",
                    startTime: "09:00",
                    endTime: "12:00",
                    room: "Labo Informatique",
                    dayOfWeek: "JEU"
                },
                {
                    id: "class-8b",
                    subject: "SQL Avancé",
                    teacher: "Prof. Garcia",
                    startTime: "14:00",
                    endTime: "17:00",
                    room: "Labo Informatique",
                    dayOfWeek: "JEU"
                }
            ]
        },
        {
            id: "classroom-4",
            name: "Amphithéâtre",
            capacity: 100,
            building: "Bâtiment C",
            floor: 1,
            plannedClasses: [
                {
                    id: "class-9",
                    subject: "Conférence Générale",
                    teacher: "Prof. Directeur",
                    startTime: "10:00",
                    endTime: "12:00",
                    room: "Amphithéâtre",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-9b",
                    subject: "Présentation Projets",
                    teacher: "Prof. Directeur",
                    startTime: "14:00",
                    endTime: "16:00",
                    room: "Amphithéâtre",
                    dayOfWeek: "LUN"
                },
                {
                    id: "class-10",
                    subject: "Séminaire",
                    teacher: "Prof. Expert",
                    startTime: "10:00",
                    endTime: "12:00",
                    room: "Amphithéâtre",
                    dayOfWeek: "VEN"
                },
                {
                    id: "class-10b",
                    subject: "Workshop",
                    teacher: "Prof. Expert",
                    startTime: "14:00",
                    endTime: "17:00",
                    room: "Amphithéâtre",
                    dayOfWeek: "VEN"
                }
            ]
        }
    ]
};

// Mock function to simulate API call
const fetchWeekPlanning = async (weekNumber: number, year: number): Promise<WeekPlanningData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data with updated week and year
    return {
        ...mockWeekPlanningData,
        weekNumber,
        year
    };
};

const PlanningContainer = () => {
    const [currentWeek, setCurrentWeek] = useState<{ day: string, date: string, fullDate: Date }[]>([]);
    const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(getCurrentWeekNumber());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [weekPlanningData, setWeekPlanningData] = useState<WeekPlanningData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setCurrentWeek(getDatesOfWeek(currentWeekNumber, currentYear));
    }, [currentWeekNumber, currentYear]);

    // useEffect will be replaced by tanstack query when server route is ready
    useEffect(() => {
        const loadWeekPlanning = async () => {
            setIsLoading(true);
            try {
                const data = await fetchWeekPlanning(currentWeekNumber, currentYear);
                setWeekPlanningData(data);
            } catch (error) {
                console.error('Error loading week planning:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWeekPlanning();
    }, [currentWeekNumber, currentYear]);

    const handleWeekChange = (weekNumber: number, year: number) => {
        setCurrentWeekNumber(weekNumber);
        setCurrentYear(year);
    };

    const getClassesForDay = (classroom: Classroom, dayOfWeek: string) => {
        return classroom.plannedClasses.filter(cls => cls.dayOfWeek === dayOfWeek);
    };

    return (
        <div className="w-full">
            <WeekSelector
                currentWeekNumber={currentWeekNumber}
                currentYear={currentYear}
                onWeekChange={handleWeekChange}
            />

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
                                        <td key={day.day} className="flex-1 h-96">
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