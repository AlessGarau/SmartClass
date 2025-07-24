// Mock API functions for planning data
import type { WeekPlanningData } from '../types/Planning';

export interface Building {
    id: string;
    name: string;
    floors: number[];
}

// Mock data for buildings
export const mockBuildings: Building[] = [
    { id: "batA", name: "Bâtiment A", floors: [1, 2, 3] },
    { id: "batB", name: "Bâtiment B", floors: [1, 2] },
    { id: "batC", name: "Bâtiment C", floors: [1] },
];

// Helper to get building display name
export const getBuildingDisplayName = (buildingId: string): string => {
    const building = mockBuildings.find(b => b.id === buildingId);
    return building?.name || buildingId;
};

// Mock function to fetch available buildings
export const fetchBuildings = async (): Promise<Building[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBuildings;
};

// Mock function to fetch floors for a specific building
export const fetchFloorsForBuilding = async (buildingId: string): Promise<number[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const building = mockBuildings.find(b => b.id === buildingId);
    return building?.floors || [];
};

// Temporary mock data until back is ready
const mockWeekPlanningData: WeekPlanningData = {
    weekNumber: 1,
    year: 2024,
    classrooms: [
        {
            id: "classroom-1",
            name: "Salle 101",
            capacity: 30,
            building: "batA",
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
            building: "batA",
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
            building: "batB",
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
            building: "batC",
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
        },
        // Adding some rooms on different floors for testing
        {
            id: "classroom-5",
            name: "Salle 201",
            capacity: 30,
            building: "batA",
            floor: 2,
            plannedClasses: [
                {
                    id: "class-11",
                    subject: "Chimie",
                    teacher: "Prof. Laurent",
                    startTime: "10:00",
                    endTime: "12:00",
                    room: "Salle 201",
                    dayOfWeek: "LUN"
                }
            ]
        },
        {
            id: "classroom-6",
            name: "Salle 301",
            capacity: 25,
            building: "batA",
            floor: 3,
            plannedClasses: [
                {
                    id: "class-12",
                    subject: "Philosophie",
                    teacher: "Prof. Moreau",
                    startTime: "14:00",
                    endTime: "16:00",
                    room: "Salle 301",
                    dayOfWeek: "VEN"
                }
            ]
        }
    ]
};

// Mock function to simulate API call with filtering
export const fetchWeekPlanning = async (
    weekNumber: number, 
    year: number,
    buildingFilter?: string,
    floorFilter?: number
): Promise<WeekPlanningData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Apply filters (simulating server-side filtering)
    const filteredClassrooms = mockWeekPlanningData.classrooms.filter(classroom => {
        if (buildingFilter && classroom.building !== buildingFilter) {
            return false;
        }
        if (floorFilter !== undefined && classroom.floor !== floorFilter) {
            return false;
        }
        return true;
    });

    // Return filtered data with updated week and year
    return {
        weekNumber,
        year,
        classrooms: filteredClassrooms
    };
};