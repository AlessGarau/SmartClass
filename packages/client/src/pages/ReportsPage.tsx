import { useState } from "react";
import FilterIcon from "../assets/icons/filter_icon.svg";
import Button from "../components/Button/Button";
import Dropdown from "../components/Dropdown/Dropdown";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import { AddIcon } from "../components/Icon/AddIcon";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { ReportFilters } from "../types/Reports";

const ReportsPage = () => {
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState<ReportFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<ReportFilters>({});
    const [isAddReportSectionVisible, setAddReportSectionVisible] = useState(false);
    const isMdScreen = useMediaQuery("(min-width: 768px)");

    //#region Queries
    //#endregion

    //#region Options
    const statusOptions = [
        { label: "Tous les états", value: "" },
        { label: "En cours", value: "pending" },
        { label: "Résolu", value: "resolved" }
    ];
    //#endregion

    //#region Handlers
    const handleChange = (field: keyof ReportFilters, value: string | number): void => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (value === undefined || value === "") {
                delete newFilters[field];
            } else {
                newFilters[field] = value as any;
            }
            return newFilters;
        });
    };

    const handleFilter = (): void => {
        setAppliedFilters(filters);
        setOffset(0);
    };

    const showAddReportSection = (): void => {
        setAddReportSectionVisible(true);
    }
    //#endregion

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Signalement des dysfonctionnements</h1>
                    <div className="text-base sm:text-lg md:text-[20px]">Signalez les problèmes d’équipement ou d’environnements dans les salles de classes</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        label={isMdScreen ? "Nouveau signalement" : undefined}
                        iconTSX={<AddIcon bgColor="white" plusColor="teal" className="w-4 h-4" />}
                        onClick={showAddReportSection}
                        disabled={isAddReportSectionVisible}
                        tooltip={!isMdScreen ? "Nouveau signalement" : undefined}
                    />
                </div>
            </div>
            <FilterContainer>
                {/* TODO ADD ROOM NAME / EQUIPEMENT TYPE */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Bâtiment :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Tous les états"
                        value={filters.status || ""}
                        options={statusOptions}
                        onSelect={(option) => handleChange("status", option.value as string)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <Button
                        label="Filtrer"
                        icon={FilterIcon}
                        onClick={handleFilter}
                        className="w-full"
                    />
                </div>
            </FilterContainer>
        </div>
    );
};

export default ReportsPage;