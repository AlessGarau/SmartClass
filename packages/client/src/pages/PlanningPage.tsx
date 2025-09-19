import { useState, useRef } from "react";
import Button from "../components/Button/Button";
import PlusIcon from "../assets/icons/add_icon.svg"
import DownloadIcon from "../assets/icons/download_icon.svg"
import ChevronLeftIcon from "../assets/icons/chevron_left.svg"
import ChevronRightIcon from "../assets/icons/chevron_right.svg"
import FilterContainer from "../components/FilterContainer/FilterContainer";
import Dropdown from "../components/Dropdown/Dropdown";
import PlanningContainer from "../components/Planning/PlanningContainer/PlanningContainer";
import ColorLegend from "../components/ColorLegend/ColorLegend";
import { format, formatISO, addDays, startOfISOWeek, eachWeekOfInterval, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { PlanningFilters } from "../types/Planning";
import { PLANNING_LEGEND_ITEMS } from "../constants/planning";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planningQueryOptions } from "../api/queryOptions";
import toast from "react-hot-toast";
import { useMediaQuery } from "../hooks/useMediaQuery";

const PlanningPage = () => {
    const queryClient = useQueryClient()
    const currentYear = new Date().getFullYear();
    const today = new Date();
    const currentWeekStart = startOfISOWeek(today);
    const currentWeekEnd = addDays(currentWeekStart, 4); // Friday
    const isMdScreen = useMediaQuery('(min-width: 768px)');

    const [filters, setFilters] = useState<PlanningFilters>({
        startDate: formatISO(currentWeekStart, { representation: 'date' }),
        endDate: formatISO(currentWeekEnd, { representation: 'date' }),
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
            let message = `Fichier importé avec succès ! `;
            const parts: string[] = [];

            if (data.importedCount > 0) {
                parts.push(`${data.importedCount} cours ajoutés`);
            }
            if (data.updatedCount > 0) {
                parts.push(`${data.updatedCount} cours mis à jour`);
            }
            if (data.skippedCount > 0) {
                parts.push(`${data.skippedCount} cours ignorés (aucun changement car déjà existant)`);
            }

            if (parts.length > 0) {
                message += parts.join(', ');
            } else {
                message = 'Aucun changement détecté dans le fichier importé.';
            }

            toast.success(message);

            if (data.optimization?.status === 'failed') {
                toast.error(`Attention: L'optimisation des salles a échoué. ${data.optimization.error || 'Erreur inconnue'}`);
            }

            queryClient.invalidateQueries({ queryKey: ['planning', 'weekly'] });
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
        const friday = addDays(monday, 4);
        const label = `${format(monday, 'dd MMM', { locale: fr })} - ${format(friday, 'dd MMM yyyy', { locale: fr })}`;
        return {
            label,
            value: JSON.stringify({
                startDate: formatISO(monday, { representation: 'date' }),
                endDate: formatISO(friday, { representation: 'date' })
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

    const handlePreviousWeek = () => {
        const currentStart = new Date(filters.startDate);
        const newStart = addDays(currentStart, -7);
        const newEnd = addDays(newStart, 4);
        setFilters(prev => ({
            ...prev,
            startDate: formatISO(newStart, { representation: 'date' }),
            endDate: formatISO(newEnd, { representation: 'date' })
        }));
    };

    const handleNextWeek = () => {
        const currentStart = new Date(filters.startDate);
        const newStart = addDays(currentStart, 7);
        const newEnd = addDays(newStart, 4);
        setFilters(prev => ({
            ...prev,
            startDate: formatISO(newStart, { representation: 'date' }),
            endDate: formatISO(newEnd, { representation: 'date' })
        }));
    };

    const handleBuildingChange = (value: string) => {
        setFilters(prev => ({ ...prev, building: value ? value : undefined }));
    };

    const handleFloorChange = (value: number) => {
        setFilters(prev => ({ ...prev, floor: value ? value : undefined }));
    };

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Planning</h1>
                    <div className="text-base sm:text-lg md:text-[20px]">
                        Plannifiez et gérer la réservation des classes
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        label={isMdScreen ? "Exemple excel" : undefined}
                        icon={DownloadIcon}
                        onClick={() => downloadTemplateMutation.mutate()}
                        disabled={downloadTemplateMutation.isPending}
                        tooltip={!isMdScreen ? "Télécharger un exemple d'excel" : undefined}
                    />
                    <Button
                        label={isMdScreen ? "Importer une feuille" : undefined}
                        icon={PlusIcon}
                        onClick={handleImportClick}
                        disabled={uploadLessonsMutation.isPending}
                        tooltip={!isMdScreen ? "Importer une feuille" : undefined}
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Semaine :</label>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            onClick={handlePreviousWeek}
                            icon={ChevronLeftIcon}
                            tooltip="Semaine précédente"
                        />
                        <Dropdown
                            options={weekOptions}
                            value={weekOptions.find(opt => {
                                const optDateRange = JSON.parse(opt.value);
                                return optDateRange.startDate === filters.startDate &&
                                    optDateRange.endDate === filters.endDate;
                            })?.value}
                            placeholder="Sélectionner une semaine"
                            onSelect={(option) => handleWeekChange(option.value as string)}
                            className="min-w-0 w-full sm:min-w-[200px]"
                        />
                        <Button
                            onClick={handleNextWeek}
                            icon={ChevronRightIcon}
                            tooltip="Semaine suivante"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Bâtiment :</label>
                    <Dropdown
                        options={buildingOptions}
                        value={filters.building || ""}
                        placeholder="Tous les bâtiments"
                        onSelect={(option) => handleBuildingChange(option.value as string)}
                        className="w-full sm:min-w-[200px]"
                        disabled={isLoadingFilters}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Étage :</label>
                    <Dropdown
                        options={floorOptions}
                        value={filters.floor ? String(filters.floor) : ""}
                        placeholder="Tous les étages"
                        onSelect={(option) => handleFloorChange(option.value as number)}
                        className="w-full sm:min-w-[200px]"
                        disabled={isLoadingFilters}
                    />
                </div>
                <ColorLegend items={PLANNING_LEGEND_ITEMS} className="w-full lg:w-auto lg:ml-auto" />
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