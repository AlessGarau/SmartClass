import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { teacherQueryOptions } from "../api/queryOptions";
import ChevronLeftIcon from "../assets/icons/chevron_left.svg";
import ChevronRightIcon from "../assets/icons/chevron_right.svg";
import FilterIcon from "../assets/icons/filter_icon.svg";
import Button from "../components/Button/Button";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import { AddIcon } from "../components/Icon/AddIcon";
import Popin from "../components/Popin/Popin";
import TeachersContainer from "../components/Teacher/TeachersContainer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Teacher, TeacherCreate, TeacherFilters } from "../types/Teacher";

const TeachersPage = () => {
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState<TeacherFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<TeacherFilters>({});
    const [isAddTeacherSectionVisible, setAddTeacherSectionVisible] = useState(false);
    const [newTeacherData, setNewTeacherData] = useState<TeacherCreate>({
        email: "",
        firstName: "",
        lastName: "",
    });
    const isMdScreen = useMediaQuery("(min-width: 768px)");

    //#region Queries
    const queryClient = useQueryClient();
    const { data: teachersData } = useQuery(teacherQueryOptions.getTeachers({ ...appliedFilters, limit, offset }));
    const { data: teachersCountData } = useQuery(teacherQueryOptions.teacherCount(appliedFilters));
    const createTeacherMutation = useMutation({
        ...teacherQueryOptions.createTeacher(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher", "allTeachers"] });
            queryClient.invalidateQueries({ queryKey: ["teacher", "count"] });
            setAddTeacherSectionVisible(false);
            setNewTeacherData({
                email: "",
                firstName: "",
                lastName: "",
            });
        }
    });
    //#endregion

    //#region Pagination
    const totalTeachers = teachersCountData?.data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalTeachers / limit));
    const currentPage = Math.floor(offset / limit) + 1;
    const isPrevDisabled = offset === 0;
    const isNextDisabled = offset + limit >= totalTeachers;
    //#endregion

    //#region Handlers
    const handleChange = (field: keyof TeacherFilters, value: string | number | undefined): void => {
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

    const showAddTeacherSection = (): void => {
        setAddTeacherSectionVisible(true);
    }

    const handleNewTeacherSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTeacherMutation.mutate({ ...newTeacherData });
    };

    const handleNewTeacherChange = (field: keyof TeacherCreate, value: string | number) => {
        setNewTeacherData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePrev = (): void => setOffset((prev) => Math.max(0, prev - limit));
    const handleNext = (): void => setOffset((prev) => prev + limit);
    //#endregion

    //#region Render
    const teachers: Teacher[] = teachersData?.data ?? [];
    //#endregion

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <Popin
                open={isAddTeacherSectionVisible}
                title="Créer un enseignant"
                icon={<AddIcon bgColor="teal" plusColor="white" />}
                onClose={() => setAddTeacherSectionVisible(false)}
                actions={
                    <>
                        <Button type="submit" label={createTeacherMutation.isPending ? "Création..." : "Créer"} className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={createTeacherMutation.isPending} form="add-teacher-form" />
                        <Button type="button" label="Annuler" className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setAddTeacherSectionVisible(false)} />
                    </>
                }
            >
                <form id="add-teacher-form" onSubmit={handleNewTeacherSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Email :</label>
                            <input type="email" value={newTeacherData.email} onChange={e => handleNewTeacherChange('email', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Adresse email" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Prénom :</label>
                            <input type="text" value={newTeacherData.firstName} onChange={e => handleNewTeacherChange('firstName', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Prénom" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nom :</label>
                            <input type="text" value={newTeacherData.lastName} onChange={e => handleNewTeacherChange('lastName', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Nom" />
                        </div>
                    </div>
                </form>
            </Popin>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Gestion des enseignants</h1>
                    <div className="text-base sm:text-lg md:text-[20px]">Créez et gérez les enseignants</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        label={isMdScreen ? "Nouvel enseignant" : undefined}
                        iconTSX={<AddIcon bgColor="white" plusColor="teal" className="w-4 h-4" />}
                        onClick={showAddTeacherSection}
                        disabled={isAddTeacherSectionVisible}
                        tooltip={!isMdScreen ? "Nouvel enseignant" : undefined}
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
                {teachersCountData?.data?.count !== undefined && (
                    <span>{teachersCountData.data.count} enseignant{teachersCountData.data.count > 1 ? "s" : ""} trouvé{teachersCountData.data.count > 1 ? "s" : ""}</span>
                )}
            </div>
            {Array.isArray(teachers) && teachers.length > 0 && <TeachersContainer displayedTeachers={teachers} />}
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

export default TeachersPage;