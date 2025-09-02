import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { reportQueryOptions, roomQueryOptions } from "../api/queryOptions";
import ChevronLeftIcon from "../assets/icons/chevron_left.svg";
import ChevronRightIcon from "../assets/icons/chevron_right.svg";
import FilterIcon from "../assets/icons/filter_icon.svg";
import Button from "../components/Button/Button";
import Dropdown from "../components/Dropdown/Dropdown";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import { AddIcon } from "../components/Icon/AddIcon";
import Popin from "../components/Popin/Popin";
import ReportsContainer from "../components/Report/ReportsContainer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { ReportFilters } from "../types/Reports";

const ReportsPage = () => {
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState<ReportFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<ReportFilters>({});
    const [isAddReportSectionVisible, setAddReportSectionVisible] = useState(false);
    const [newReportData, setNewReportData] = useState({
        equipmentId: "",
        description: "",
    });
    const isMdScreen = useMediaQuery("(min-width: 768px)");

    //#region Queries
    const queryClient = useQueryClient();
    const { data: roomNameData, isLoading: isLoadingRoomName } = useQuery(roomQueryOptions.roomNameOptions());
    const { data: reportsData } = useQuery(reportQueryOptions.getReports({ ...appliedFilters, limit, offset }));
    const { data: reportsCountData } = useQuery(reportQueryOptions.reportCount(appliedFilters));
    const createReportMutation = useMutation({
        ...reportQueryOptions.createReport(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['report', 'allReports'] });
            queryClient.invalidateQueries({ queryKey: ['report', 'count'] });
            queryClient.invalidateQueries({ queryKey: ['room', 'nameOptions'] });
            setAddReportSectionVisible(false);
            setNewReportData({ equipmentId: "", description: "" });
        }
    });
    //#endregion

    //#region Options
    const roomNameOptions = [
        { label: "Toutes les salles", value: "" },
        ...(roomNameData?.data.names || []),
    ];

    const equipmentTypeOptions = [
        { label: "Tous les équipements", value: "" },
        { label: "Chauffage", value: "heater" },
        { label: "Climatisation", value: "ac" },
    ];

    const statusOptions = [
        { label: "Tous les états", value: "" },
        { label: "En cours", value: "pending" },
        { label: "Résolu", value: "resolved" }
    ];
    //#endregion

    //#region Pagination
    const totalReports = reportsCountData?.data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalReports / limit));
    const currentPage = Math.floor(offset / limit) + 1;
    const isPrevDisabled = offset === 0;
    const isNextDisabled = offset + limit >= totalReports;
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

    const handleNewReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createReportMutation.mutate({ ...newReportData });
    };

    const handleNewReportChange = (field: string, value: string | number) => {
        setNewReportData(prev => ({ ...prev, [field]: value }));
    };

    const handlePrev = (): void => setOffset((prev) => Math.max(0, prev - limit));
    const handleNext = (): void => setOffset((prev) => prev + limit);
    //#endregion

    //#region Render
    const reports = reportsData?.data ?? [];
    //#endregion

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <Popin
                open={isAddReportSectionVisible}
                title="Créer un signalement"
                icon={<AddIcon bgColor="teal" plusColor="white" />}
                onClose={() => setAddReportSectionVisible(false)}
                actions={
                    <>
                        <Button type="submit" label={createReportMutation.isPending ? "Création..." : "Créer"} className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={createReportMutation.isPending} form="add-room-form" />
                        <Button type="button" label="Annuler" className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setAddReportSectionVisible(false)} />
                    </>
                }
            >
                <form id="add-room-form" onSubmit={handleNewReportSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Equipement ID :</label>
                            <input type="text" value={newReportData.equipmentId} onChange={e => handleNewReportChange('equipmentId', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="ID de l'équipement" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Description du signalement :</label>
                            <input type="text" value={newReportData.description} onChange={e => handleNewReportChange('description', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Description du signalement" />
                        </div>
                    </div>
                </form>
            </Popin>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Salle :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Toutes les salles"
                        value={filters.roomName || ""}
                        options={roomNameOptions}
                        onSelect={(option) => handleChange("roomName", option.value)}
                        disabled={isLoadingRoomName}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Équipement :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Tous les équipements"
                        value={filters.equipmentType || ""}
                        options={equipmentTypeOptions}
                        onSelect={(option) => handleChange("equipmentType", option.value)}
                        disabled={isLoadingRoomName}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">État :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Tous les états"
                        value={filters.status || ""}
                        options={statusOptions}
                        onSelect={(option) => handleChange("status", option.value)}
                        disabled={isLoadingRoomName}
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
            <div className="mb-2 flex justify-end text-gray-600">
                {reportsCountData?.data?.count !== undefined && (
                    <span>{reportsCountData.data.count} signalement{reportsCountData.data.count > 1 ? "s" : ""} trouvé{reportsCountData.data.count > 1 ? "s" : ""}</span>
                )}
            </div>
            {Array.isArray(reports) && reports.length > 0 && <ReportsContainer displayedReports={reports} />}
            <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                    onClick={handlePrev}
                    icon={ChevronLeftIcon}
                    disabled={isPrevDisabled}
                    className={isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}
                />
                <span className="mx-2 text-gray-700">{currentPage} / {totalPages}</span>
                <Button
                    onClick={handleNext}
                    icon={ChevronRightIcon}
                    disabled={isNextDisabled}
                    className={isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}
                />
            </div>
        </div>
    );
};

export default ReportsPage;