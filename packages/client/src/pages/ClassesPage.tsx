import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { classQueryOptions } from "../api/queryOptions";
import ChevronLeftIcon from "../assets/icons/chevron_left.svg";
import ChevronRightIcon from "../assets/icons/chevron_right.svg";
import FilterIcon from "../assets/icons/filter_icon.svg";
import Button from "../components/Button/Button";
import ClassesContainer from "../components/Class/ClassesContainer";
// import Dropdown from "../components/Dropdown/Dropdown";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import { AddIcon } from "../components/Icon/AddIcon";
import Popin from "../components/Popin/Popin";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Class, ClassCreate, ClassFilters } from "../types/Class";

const ClassesPage = () => {
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState<ClassFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<ClassFilters>({});
    const [isAddClassSectionVisible, setAddClassSectionVisible] = useState(false);
    const [newClassData, setNewClassData] = useState<ClassCreate>({
        name: "",
        studentCount: 0,
    });
    const isMdScreen = useMediaQuery("(min-width: 768px)");

    //#region Queries
    const queryClient = useQueryClient();
    const { data: classesData } = useQuery(classQueryOptions.getClasses({ ...appliedFilters, limit, offset }));
    const { data: classesCountData } = useQuery(classQueryOptions.classCount(appliedFilters));
    const createClassMutation = useMutation({
        ...classQueryOptions.createClass(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class", "allClasses"] });
            queryClient.invalidateQueries({ queryKey: ["class", "count"] });
            setAddClassSectionVisible(false);
            setNewClassData({
                name: "",
                studentCount: 0,
            });
        }
    });
    //#endregion

    //#region Pagination
    const totalClasses = classesCountData?.data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalClasses / limit));
    const currentPage = Math.floor(offset / limit) + 1;
    const isPrevDisabled = offset === 0;
    const isNextDisabled = offset + limit >= totalClasses;
    //#endregion

    //#region Handlers
    const handleChange = (field: keyof ClassFilters, value: string | number | undefined): void => {
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

    const showAddClassSection = (): void => {
        setAddClassSectionVisible(true);
    }

    const handleNewClassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createClassMutation.mutate({ ...newClassData });
    };

    const handleNewClassChange = (field: keyof ClassCreate, value: string | number) => {
        setNewClassData(prev => ({
            ...prev,
            [field]: field === "studentCount" ? Number(value) : value
        }));
    };

    const handlePrev = (): void => setOffset((prev) => Math.max(0, prev - limit));
    const handleNext = (): void => setOffset((prev) => prev + limit);
    //#endregion

    //#region Render
    const classes: Class[] = classesData?.data ?? [];
    //#endregion

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <Popin
                open={isAddClassSectionVisible}
                title="Créer une promotion"
                icon={<AddIcon bgColor="teal" plusColor="white" />}
                onClose={() => setAddClassSectionVisible(false)}
                actions={
                    <>
                        <Button type="submit" label={createClassMutation.isPending ? "Création..." : "Créer"} className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={createClassMutation.isPending} form="add-class-form" />
                        <Button type="button" label="Annuler" className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setAddClassSectionVisible(false)} />
                    </>
                }
            >
                <form id="add-class-form" onSubmit={handleNewClassSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nom de la promotion :</label>
                            <input type="text" value={newClassData.name} onChange={e => handleNewClassChange('name', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Nom de la promotion" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nombre d'élèves :</label>
                            <input type="number" min={0} value={newClassData.studentCount} onChange={e => handleNewClassChange('studentCount', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Nombre d'élèves" />
                        </div>
                    </div>
                </form>
            </Popin>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Gestion des promotions</h1>
                    <div className="text-base sm:text-lg md:text-[20px]">Créez et gérez les promotions et leur nombre d'élèves</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        label={isMdScreen ? "Nouvelle promotion" : undefined}
                        iconTSX={<AddIcon bgColor="white" plusColor="teal" className="w-4 h-4" />}
                        onClick={showAddClassSection}
                        disabled={isAddClassSectionVisible}
                        tooltip={!isMdScreen ? "Nouvelle promotion" : undefined}
                    />
                </div>
            </div>
            <FilterContainer>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label htmlFor="search-room" className="sr-only">
                        Rechercher une salle
                    </label>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <path strokeWidth="2" d="M21 21l-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        id="search-room"
                        type="text"
                        className="pl-10 pr-10 w-full sm:min-w-[400px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        placeholder="Rechercher par nom"
                        value={filters.search || ""}
                        onChange={(e) => handleChange("search", e.target.value)}
                        autoComplete="off"
                    />
                    {filters.search && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => handleChange("search", undefined)}
                            tabIndex={0}
                            aria-label="Effacer la recherche"
                        >
                            <svg
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeWidth="2"
                                    d="M6 6l12 12M6 18L18 6"
                                />
                            </svg>
                        </button>
                    )}
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
                {classesCountData?.data?.count !== undefined && (
                    <span>{classesCountData.data.count} promotion{classesCountData.data.count > 1 ? "s" : ""} trouvée{classesCountData.data.count > 1 ? "s" : ""}</span>
                )}
            </div>
            {Array.isArray(classes) && classes.length > 0 && <ClassesContainer displayedClasses={classes} />}
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

export default ClassesPage;