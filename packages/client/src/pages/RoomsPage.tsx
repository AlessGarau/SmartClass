import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { roomQueryOptions } from "../api/queryOptions";
import ChevronLeftIcon from "../assets/icons/chevron_left.svg";
import ChevronRightIcon from "../assets/icons/chevron_right.svg";
import FilterIcon from "../assets/icons/filter_icon.svg";
import Button from "../components/Button/Button";
import Dropdown from "../components/Dropdown/Dropdown";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import { AddIcon } from "../components/Icon/AddIcon";
import Popin from "../components/Popin/Popin";
import RoomsContainer from "../components/Room/RoomsContainer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { RoomFilters } from "../types/Room";

const RoomsPage = () => {
    const limit = 6;
    const [offset, setOffset] = useState(0);
    const [isAddRoomSectionVisible, setAddRoomSectionVisible] = useState(false);
    const [newRoomData, setNewRoomData] = useState({
        name: "",
        building: "",
        floor: 0,
        capacity: 1,
    });
    const [filters, setFilters] = useState<RoomFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<RoomFilters>({});
    const isMdScreen = useMediaQuery("(min-width: 768px)");

    //#region Queries
    const { data: buildingData, isLoading: isLoadingBuildings } = useQuery(roomQueryOptions.buildingOptions());
    const { data: roomsData } = useQuery(roomQueryOptions.getRooms({ ...appliedFilters, limit, offset }));
    const { data: roomsCountData } = useQuery(roomQueryOptions.roomCount(appliedFilters));
    const { data: floorData, isLoading: isLoadingFloors } = useQuery({
        ...roomQueryOptions.floorOptions(filters.building ?? ""),
        enabled: !!filters.building,
    });
    const queryClient = useQueryClient();
    const createRoomMutation = useMutation({
        ...roomQueryOptions.createRoom(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room', 'allRooms'] });
            queryClient.invalidateQueries({ queryKey: ['room', 'count'] });
            queryClient.invalidateQueries({ queryKey: ['room', 'buildingOptions'] });
            queryClient.invalidateQueries({ queryKey: ['room', 'floorOptions'] });
            setAddRoomSectionVisible(false);
            setNewRoomData({ name: "", building: "", floor: 0, capacity: 1 });
        }
    });
    //#endregion

    //#region Options
    const buildingOptions = [
        { label: "Tous les bâtiments", value: "" },
        ...(buildingData?.data.buildings || []),
    ];
    const floorOptions = filters.building
        ? [
            { label: "Tous les étages", value: "" },
            ...((floorData?.data?.floors || []).map((floor) => ({
                label: floor.label,
                value: String(floor.value),
            }))),
        ]
        : [];
    //#endregion

    //#region Pagination
    const totalRooms = roomsCountData?.data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalRooms / limit));
    const currentPage = Math.floor(offset / limit) + 1;
    const isPrevDisabled = offset === 0;
    const isNextDisabled = offset + limit >= totalRooms;
    //#endregion

    //#region Handlers
    const handleChange = (field: keyof RoomFilters, value: string | number | boolean | undefined): void => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (value === undefined || value === "") {
                delete newFilters[field];
            } else {
                newFilters[field] = value as any;
            }
            if (field === "building") delete newFilters.floor;
            return newFilters;
        });
    };

    const handleFilter = (): void => {
        setAppliedFilters(filters);
        setOffset(0);
    };

    const handlePrev = (): void => setOffset((prev) => Math.max(0, prev - limit));
    const handleNext = (): void => setOffset((prev) => prev + limit);
    const showAddRoomSection = (): void => {
        setAddRoomSectionVisible(true);
    };

    const handleNewRoomChange = (field: string, value: string | number) => {
        setNewRoomData(prev => ({ ...prev, [field]: value }));
    };

    const handleNewRoomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createRoomMutation.mutate({ ...newRoomData, floor: Number(newRoomData.floor), capacity: Number(newRoomData.capacity) });
    };
    //#endregion

    //#region Render
    const rooms = roomsData?.data ?? [];
    //#endregion

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:p-20">
            <Popin
                open={isAddRoomSectionVisible}
                title="Créer une salle"
                icon={<AddIcon bgColor="teal" plusColor="white" />}
                onClose={() => setAddRoomSectionVisible(false)}
                actions={
                    <>
                        <Button type="submit" label={createRoomMutation.isPending ? "Création..." : "Créer"} className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={createRoomMutation.isPending} form="add-room-form" />
                        <Button type="button" label="Annuler" className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setAddRoomSectionVisible(false)} />
                    </>
                }
            >
                <form id="add-room-form" onSubmit={handleNewRoomSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nom de la salle :</label>
                            <input type="text" value={newRoomData.name} onChange={e => handleNewRoomChange('name', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Nom de la salle" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Bâtiment :</label>
                            <input type="text" value={newRoomData.building} onChange={e => handleNewRoomChange('building', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Nom du bâtiment" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Étage :</label>
                            <input type="number" value={newRoomData.floor} onChange={e => handleNewRoomChange('floor', Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Numéro d'étage" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nombre de personnes max :</label>
                            <input type="number" value={newRoomData.capacity} onChange={e => handleNewRoomChange('capacity', Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required placeholder="Capacité maximale" />
                        </div>
                    </div>
                </form>
            </Popin>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Salles</h1>
                    <div className="text-base sm:text-lg md:text-[20px]">Gérer et contrôler l’état de vos salles</div>
                </div>
                <div className="flex gap-2">
                    <Button
                        label={isMdScreen ? "Créer une salle" : undefined}
                        iconTSX={<AddIcon bgColor="white" plusColor="teal" className="w-4 h-4" />}
                        onClick={showAddRoomSection}
                        disabled={isAddRoomSectionVisible}
                        tooltip={!isMdScreen ? "Créer une salle" : undefined}
                    />
                </div>
            </div>
            <FilterContainer>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label htmlFor="search-room" className="sr-only">Rechercher une salle</label>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path strokeWidth="2" d="M21 21l-4.35-4.35" /></svg>
                    </span>
                    <input
                        id="search-room"
                        type="text"
                        className="pl-10 pr-10 w-full sm:min-w-[400px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        placeholder="Rechercher par nom"
                        value={filters.search || ""}
                        onChange={(e) => handleChange("search", e.target.value)}
                        disabled={isLoadingBuildings}
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
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M6 6l12 12M6 18L18 6" /></svg>
                        </button>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Bâtiment :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Tous les bâtiments"
                        value={filters.building || ""}
                        options={buildingOptions}
                        onSelect={(option) => handleChange("building", option.value as string)}
                        disabled={isLoadingBuildings}
                    />
                </div>
                {filters.building && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Étage :</label>
                        <Dropdown
                            className="w-full sm:min-w-[200px]"
                            placeholder="Tous les étages"
                            value={filters.floor !== undefined && filters.floor !== null ? String(filters.floor) : ""}
                            options={floorOptions}
                            onSelect={(option) => {
                                const val = option.value as string;
                                handleChange("floor", val === "" ? undefined : parseInt(val));
                            }}
                            disabled={isLoadingFloors}
                        />
                    </div>
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Disponibilité :</label>
                    <Dropdown
                        className="w-full sm:min-w-[200px]"
                        placeholder="Toutes"
                        value={filters.isEnabled !== undefined ? String(filters.isEnabled) : ""}
                        options={[
                            { label: "Toutes", value: "" },
                            { label: "Activées", value: "true" },
                            { label: "Désactivées", value: "false" },
                        ]}
                        onSelect={(option) => {
                            const val = option.value as string;
                            handleChange("isEnabled", val === "" ? undefined : val === "true" ? true : false);
                        }}
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
                {roomsCountData?.data?.count !== undefined && (
                    <span>{roomsCountData.data.count} salle{roomsCountData.data.count > 1 ? "s" : ""} trouvée{roomsCountData.data.count > 1 ? "s" : ""}</span>
                )}
            </div>
            {Array.isArray(rooms) && rooms.length > 0 && <RoomsContainer displayedRooms={rooms} />}
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

export default RoomsPage;
