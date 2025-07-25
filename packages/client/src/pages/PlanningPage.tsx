import { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import PlusIcon from "../assets/icons/add_icon.svg"
import FilterContainer from "../components/FilterContainer/FilterContainer";
import Select from "../components/Select/SelectContainer";
import PlanningContainer from "../components/Planning/PlanningContainer/PlanningContainer";
import ColorLegend from "../components/ColorLegend/ColorLegend";
import { getCurrentWeekNumber, getWeeksInYear } from "../utils/dates";
import { fetchBuildings, type Building } from "../api/mockPlanningApi";
import type { PlanningFilters } from "../types/Planning";
import { PLANNING_LEGEND_ITEMS } from "../constants/planning";

const PlanningPage = () => {
    const currentYear = new Date().getFullYear();
    const currentWeekNum = getCurrentWeekNumber();

    const [filters, setFilters] = useState<PlanningFilters>({
        weekNumber: currentWeekNum,
        year: currentYear,
        building: undefined,
        floor: undefined
    });

    const [buildings, setBuildings] = useState<Building[]>([]);
    const [availableFloors, setAvailableFloors] = useState<number[]>([]);
    const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);

    useEffect(() => {
        const loadBuildings = async () => {
            try {
                const data = await fetchBuildings();
                setBuildings(data);
            } catch (error) {
                console.error('Error loading buildings:', error);
            } finally {
                setIsLoadingBuildings(false);
            }
        };
        loadBuildings();
    }, []);

    useEffect(() => {
        if (filters.building) {
            const selectedBuilding = buildings.find(b => b.id === filters.building);
            setAvailableFloors(selectedBuilding?.floors || []);
            if (filters.floor && !selectedBuilding?.floors.includes(filters.floor)) {
                setFilters(prev => ({ ...prev, floor: undefined }));
            }
        } else {
            setAvailableFloors([]);
            setFilters(prev => ({ ...prev, floor: undefined }));
        }
    }, [filters.building, buildings, filters.floor]);

    const weekOptions = Array.from({ length: getWeeksInYear(filters.year) }, (_, i) => ({
        label: `Semaine ${i + 1}`,
        value: String(i + 1)
    }));

    const buildingOptions = [
        { label: "Tous les bâtiments", value: "" },
        ...buildings.map(b => ({ label: b.name, value: b.id }))
    ];

    const floorOptions = [
        { label: "Tous les étages", value: "" },
        ...availableFloors.map(f => ({ label: `Étage ${f}`, value: String(f) }))
    ];

    const handleWeekChange = (value: string | string[]) => {
        const weekValue = Array.isArray(value) ? value[0] : value;
        setFilters(prev => ({ ...prev, weekNumber: parseInt(weekValue) }));
    };

    const handleBuildingChange = (value: string | string[]) => {
        const buildingValue = Array.isArray(value) ? value[0] : value;
        setFilters(prev => ({ ...prev, building: buildingValue || undefined }));
    };

    const handleFloorChange = (value: string | string[]) => {
        const floorValue = Array.isArray(value) ? value[0] : value;
        setFilters(prev => ({ ...prev, floor: floorValue ? parseInt(floorValue) : undefined }));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Planning</h1>
                    <div className="text-[20px]">
                        Plannifiez et gérer la réservation des classes
                    </div>
                </div>
                <Button label="Importer une feuille" icon={PlusIcon} />
            </div>
            <FilterContainer>
                <Select
                    options={weekOptions}
                    value={String(filters.weekNumber)}
                    label="Semaine"
                    onChange={handleWeekChange}
                    maxHeight="400px"
                />
                <Select
                    options={buildingOptions}
                    value={filters.building || ""}
                    label="Bâtiment"
                    onChange={handleBuildingChange}
                    disabled={isLoadingBuildings}
                />
                <Select
                    options={floorOptions}
                    value={filters.floor ? String(filters.floor) : ""}
                    label="Étage"
                    onChange={handleFloorChange}
                    disabled={!filters.building || availableFloors.length === 0}
                />
                <ColorLegend items={PLANNING_LEGEND_ITEMS} className="ml-auto" />
            </FilterContainer>
            <PlanningContainer
                weekNumber={filters.weekNumber}
                year={filters.year}
                buildingFilter={filters.building}
                floorFilter={filters.floor}
            />
        </div>
    );
};

export default PlanningPage;