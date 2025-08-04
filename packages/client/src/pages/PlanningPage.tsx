import { useState, useRef } from "react";
import Button from "../components/Button/Button";
import PlusIcon from "../assets/icons/add_icon.svg"
import DownloadIcon from "../assets/icons/download_icon.svg"
import FilterContainer from "../components/FilterContainer/FilterContainer";
import Dropdown from "../components/Dropdown/Dropdown";
import PlanningContainer from "../components/Planning/PlanningContainer/PlanningContainer";
import ColorLegend from "../components/ColorLegend/ColorLegend";
import { format, addDays, startOfISOWeek, endOfISOWeek, eachWeekOfInterval, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { PlanningFilters } from "../types/Planning";
import { PLANNING_LEGEND_ITEMS } from "../constants/planning";
import { useMutation, useQuery } from "@tanstack/react-query";
import { planningQueryOptions } from "../api/queryOptions";
import toast from "react-hot-toast";

const PlanningPage = () => {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    const currentWeekStart = startOfISOWeek(today);
    const currentWeekEnd = addDays(currentWeekStart, 4); // Friday

    const [filters, setFilters] = useState<PlanningFilters>({
        startDate: currentWeekStart.toISOString(),
        endDate: currentWeekEnd.toISOString(),
        year: currentYear,
        building: undefined,
        floor: undefined
    });

    const { data: filterOptions, isLoading: isLoadingFilters } = useQuery(planningQueryOptions.filterOptions());

    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplateMutation = useMutation({
        ...planningQueryOptions.downloadTemplate(),
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(data);
            console.log(url)
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lesson_import_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
        onError: (error) => {
            console.error('Error downloading template:', error);
        }
    });

    const uploadLessonsMutation = useMutation({
        ...planningQueryOptions.uploadLessons(),
        onSuccess: (data) => {
            console.log('Upload successful:', data);
            let message = `Fichier importé avec succès ! `;
            if (data.importedCount > 0) {
                message += `${data.importedCount} cours ajoutés`;
            }
            if (data.skippedCount > 0) {
                message += data.importedCount > 0 ? ` et ${data.skippedCount} cours ignorés (déjà existants)` : `${data.skippedCount} cours ignorés (déjà existants)`;
            }
            toast.success(message);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        onError: (error) => {
            console.error('Error uploading file:', error);
            toast.error('Erreur lors de l\'importation du fichier');
        }
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx')) {
                toast.error('Veuillez sélectionner un fichier Excel (.xlsx)');
                event.target.value = '';
                return;
            }
            uploadLessonsMutation.mutate(file);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const yearStart = startOfYear(new Date(filters.year, 0, 1));
    const yearEnd = endOfYear(new Date(filters.year, 0, 1));
    const weeks = eachWeekOfInterval({ start: yearStart, end: yearEnd }, { weekStartsOn: 1 });

    const weekOptions = weeks.map((weekStart) => {
        const monday = startOfISOWeek(weekStart);
        const friday = addDays(monday, 4); // Friday
        const label = `${format(monday, 'dd MMM', { locale: fr })} - ${format(friday, 'dd MMM yyyy', { locale: fr })}`;
        return {
            label,
            value: JSON.stringify({
                startDate: monday.toISOString(),
                endDate: friday.toISOString()
            })
        };
    });

    const buildingOptions = [
        { label: "Tous les bâtiments", value: "" },
        ...(filterOptions?.data.buildings || [])
    ];

    const floorOptions = [
        { label: "Tous les étages", value: "" },
        ...(filterOptions?.data.floors.map(f => ({ ...f, value: String(f.value) })) || [])
    ];

    const handleWeekChange = (value: string) => {
        const dateRange = JSON.parse(value);
        setFilters(prev => ({
            ...prev,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        }));
    };

    const handleBuildingChange = (value: string) => {
        setFilters(prev => ({ ...prev, building: value ? value : undefined }));
    };

    const handleFloorChange = (value: number) => {
        setFilters(prev => ({ ...prev, floor: value ? value : undefined }));
    };

    return (
        <div className="flex flex-col gap-4 p-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Planning</h1>
                    <div className="text-[20px]">
                        Plannifiez et gérer la réservation des classes
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={DownloadIcon}
                        onClick={() => downloadTemplateMutation.mutate()}
                        disabled={downloadTemplateMutation.isPending}
                        tooltip="Télécharger le modèle"
                    />
                    <Button
                        label="Importer une feuille"
                        icon={PlusIcon}
                        onClick={handleImportClick}
                        disabled={uploadLessonsMutation.isPending}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>
            <FilterContainer>
                <div className="flex flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Semaine :</label>
                    <Dropdown
                        options={weekOptions}
                        value={weekOptions.find(opt => {
                            const optDateRange = JSON.parse(opt.value);
                            return optDateRange.startDate === filters.startDate &&
                                optDateRange.endDate === filters.endDate;
                        })?.value}
                        placeholder="Sélectionner une semaine"
                        onSelect={(option) => handleWeekChange(option.value as string)}
                        className="min-w-[200px]"
                    />
                </div>
                <div className="flex flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Bâtiment :</label>
                    <Dropdown
                        options={buildingOptions}
                        value={filters.building || ""}
                        placeholder="Tous les bâtiments"
                        onSelect={(option) => handleBuildingChange(option.value as string)}
                        className="min-w-[200px]"
                        disabled={isLoadingFilters}
                    />
                </div>
                <div className="flex flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Étage :</label>
                    <Dropdown
                        options={floorOptions}
                        value={filters.floor ? String(filters.floor) : ""}
                        placeholder="Tous les étages"
                        onSelect={(option) => handleFloorChange(option.value as number)}
                        className="min-w-[200px]"
                        disabled={isLoadingFilters}
                    />
                </div>
                <ColorLegend items={PLANNING_LEGEND_ITEMS} className="ml-auto" />
            </FilterContainer>
            <PlanningContainer
                startDate={filters.startDate}
                endDate={filters.endDate}
                year={filters.year}
                buildingFilter={filters.building}
                floorFilter={filters.floor}
            />
        </div>
    );
};

export default PlanningPage;