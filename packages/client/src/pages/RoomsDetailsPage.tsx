import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
    roomQueryOptions,
    sensorQueryOptions,
    planningQueryOptions,
} from "../api/queryOptions";
import Dropdown from "../components/Dropdown/Dropdown";
import FilterContainer from "../components/FilterContainer/FilterContainer";
import SensorChart from "../components/Charts/SensorChart";

function RoomsDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedRoomId, setSelectedRoomId] = useState<string>(id || "");

    const getCurrentWeekDates = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + 1);

        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        return {
            startDate: monday.toISOString().split("T")[0],
            endDate: friday.toISOString().split("T")[0],
            year: today.getFullYear(),
        };
    };

    const weekDates = getCurrentWeekDates();

    const { data: roomResponse } = useQuery({
        ...roomQueryOptions.getRoom(selectedRoomId),
        enabled: !!selectedRoomId,
    });

    const { data: roomsResponse } = useQuery(roomQueryOptions.getRooms());

    const {
        data: sensorData,
        isLoading: isLoadingSensorData,
        error: sensorError,
    } = useQuery({
        ...sensorQueryOptions.dailySensorData(selectedRoomId),
        enabled: !!selectedRoomId,
        retry: 2,
        retryDelay: 1000,
    });

    // New query for room lessons
    const { data: planningData, isLoading: isLoadingPlanning } = useQuery({
        ...planningQueryOptions.weeklyPlanning({
            startDate: weekDates.startDate,
            endDate: weekDates.endDate,
            year: weekDates.year,
        }),
        enabled: !!selectedRoomId,
    });

    useEffect(() => {
        if (id && id !== selectedRoomId) {
            setSelectedRoomId(id);
        }
    }, [id, selectedRoomId]);

    const roomOptions =
        roomsResponse?.data?.map((room) => ({
            value: room.id,
            label: `${room.name} - ${room.building} (Étage ${room.floor})`,
        })) || [];

    const selectedRoom =
        roomResponse?.data ||
        roomsResponse?.data?.find((room) => room.id === selectedRoomId);

    const roomLessons =
        planningData?.data?.classrooms?.find(
            (classroom) => classroom.id === selectedRoomId
        )?.plannedClasses || [];

    const handleRoomSelect = (option: {
        value: string | number;
        label: string;
    }) => {
        const newRoomId = option.value as string;
        setSelectedRoomId(newRoomId);
        navigate(`/salles/${newRoomId}`);
    };

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-12 lg:pt-4 max-w-7xl mx-auto">
            <FilterContainer>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Salle :
                    </label>
                    <Dropdown
                        className="w-full sm:min-w-[300px]"
                        placeholder="Sélectionner une salle"
                        value={selectedRoomId}
                        options={roomOptions}
                        onSelect={handleRoomSelect}
                        disabled={
                            !roomsResponse?.data || roomOptions.length === 0
                        }
                    />
                </div>
            </FilterContainer>

            {selectedRoom && (
                <>
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Détails de la salle : {selectedRoom.name}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                    Bâtiment
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {selectedRoom.building}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Étage {selectedRoom.floor}
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                    Capacité
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {selectedRoom.capacity}
                                </div>
                                <div className="text-sm text-gray-500">
                                    personnes max
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                    État
                                </div>
                                <div
                                    className={`text-lg font-semibold ${
                                        selectedRoom.isEnabled
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {selectedRoom.isEnabled
                                        ? "Disponible"
                                        : "Non disponible"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {sensorError ? (
                        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Erreur de chargement des données de capteurs
                            </h3>
                            <p className="text-red-600 text-sm">
                                Impossible de récupérer les données de capteurs
                                pour cette salle. Les données peuvent contenir
                                des valeurs invalides.
                            </p>
                        </div>
                    ) : (
                        <SensorChart
                            sensorData={sensorData?.data || []}
                            isLoading={isLoadingSensorData}
                        />
                    )}

                    <div className="mt-4 flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 p-4 bg-white border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">
                                Cours programmés cette semaine
                            </h3>

                            {isLoadingPlanning ? (
                                <div className="flex justify-center items-center p-4">
                                    <div className="text-gray-500">
                                        Chargement des cours...
                                    </div>
                                </div>
                            ) : roomLessons.length > 0 ? (
                                <div className="space-y-3">
                                    {roomLessons
                                        .sort((a, b) => {
                                            const dayOrder = {
                                                LUN: 1,
                                                MAR: 2,
                                                MER: 3,
                                                JEU: 4,
                                                VEN: 5,
                                            };
                                            if (
                                                dayOrder[a.dayOfWeek] !==
                                                dayOrder[b.dayOfWeek]
                                            ) {
                                                return (
                                                    dayOrder[a.dayOfWeek] -
                                                    dayOrder[b.dayOfWeek]
                                                );
                                            }
                                            return a.startTime.localeCompare(
                                                b.startTime
                                            );
                                        })
                                        .map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-blue-900 mb-1">
                                                        {lesson.title}
                                                    </h4>
                                                    <div className="text-sm text-blue-700 space-y-1">
                                                        <div>
                                                            <span className="font-medium">
                                                                Professeur:
                                                            </span>{" "}
                                                            {lesson.teacher}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                Date:
                                                            </span>{" "}
                                                            {lesson.dayOfWeek}{" "}
                                                            {lesson.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:mt-0 sm:ml-4 text-right">
                                                    <div className="text-sm font-medium text-blue-900">
                                                        {lesson.startTime} -{" "}
                                                        {lesson.endTime}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <p>
                                        Aucun cours programmé cette semaine pour
                                        cette salle.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Recommandations utiles
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Augmenter l'aération
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Niveaux de CO₂ en hausse pendant les
                                            heures de pointe
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Ajuster les paramètres de la
                                            climatisation
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Optimiser pour les sessions de
                                            l'après-midi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default RoomsDetailsPage;
