import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { roomQueryOptions } from "../api/queryOptions";
import { SensorChart } from "../components/SensorChart";

function RoomDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: roomData,
        isLoading: isLoadingRoom,
        error: roomError,
    } = useQuery(roomQueryOptions.room(id!));

    const { data: allRoomsData } = useQuery(roomQueryOptions.rooms());

    const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery(
        roomQueryOptions.equipment(id!)
    );

    const { data: reportsData, isLoading: isLoadingReports } = useQuery(
        roomQueryOptions.reports(id!)
    );

    const { data: sensorsData, isLoading: isLoadingSensors } = useQuery(
        roomQueryOptions.sensors(id!)
    );

    const { data: temperatureData, isLoading: isLoadingTemperature } = useQuery(
        roomQueryOptions.temperatureData(id!)
    );

    const { data: humidityData, isLoading: isLoadingHumidity } = useQuery(
        roomQueryOptions.humidityData(id!)
    );

    const { data: pressureData, isLoading: isLoadingPressure } = useQuery(
        roomQueryOptions.pressureData(id!)
    );

    const { data: movementData, isLoading: isLoadingMovement } = useQuery(
        roomQueryOptions.movementData(id!)
    );

    if (!id) {
        return <div className="p-6 text-red-600">ID de la salle manquant</div>;
    }

    if (isLoadingRoom) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (roomError) {
        return (
            <div className="p-6 text-red-600">
                Erreur lors du chargement de la salle: {roomError.message}
            </div>
        );
    }

    const room = roomData?.data;

    if (!room) {
        return <div className="p-6 text-gray-600">Salle non trouvée</div>;
    }

    const getLatestSensorValue = (
        sensorDataArray: { savedAt: string; data: string }[]
    ) => {
        if (!sensorDataArray || sensorDataArray.length === 0) return null;
        const latest = sensorDataArray.reduce((prev, current) =>
            new Date(prev.savedAt) > new Date(current.savedAt) ? prev : current
        );
        return latest;
    };

    const latestTemperature = getLatestSensorValue(temperatureData?.data || []);
    const latestHumidity = getLatestSensorValue(humidityData?.data || []);
    const latestPressure = getLatestSensorValue(pressureData?.data || []);
    const latestMovement = getLatestSensorValue(movementData?.data || []);

    const handleRoomChange = (roomId: string) => {
        navigate(`/salles/${roomId}`);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {room.name}
                        </h1>
                        <p className="text-gray-600">Détails de la salle</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {allRoomsData?.data && allRoomsData.data.length > 0 && (
                            <div className="relative">
                                <select
                                    value={id}
                                    onChange={(e) =>
                                        handleRoomChange(e.target.value)
                                    }
                                    className="appearance-none bg-gray-50 border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors cursor-pointer"
                                >
                                    {allRoomsData.data.map((roomOption) => (
                                        <option
                                            key={roomOption.id}
                                            value={roomOption.id}
                                        >
                                            {roomOption.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                room.isEnabled
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {room.isEnabled ? "Activée" : "Désactivée"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations générales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Capacité</div>
                        <div className="text-xl font-semibold text-gray-900">
                            {room.capacity} personnes
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Bâtiment</div>
                        <div className="text-xl font-semibold text-gray-900">
                            {room.building}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Étage</div>
                        <div className="text-xl font-semibold text-gray-900">
                            {room.floor}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">ID</div>
                        <div className="text-sm font-mono text-gray-700">
                            {room.id}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Données des capteurs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <div className="text-sm text-red-600 font-medium">
                            Température
                        </div>
                        {isLoadingTemperature ? (
                            <div className="text-gray-500 text-sm">
                                Chargement...
                            </div>
                        ) : latestTemperature ? (
                            <>
                                <div className="text-2xl font-bold text-red-700">
                                    {parseFloat(latestTemperature.data).toFixed(
                                        1
                                    )}
                                    °C
                                </div>
                                <div className="text-xs text-red-600">
                                    {new Date(
                                        latestTemperature.savedAt
                                    ).toLocaleString("fr-FR")}
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Non disponible
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium">
                            Humidité
                        </div>
                        {isLoadingHumidity ? (
                            <div className="text-gray-500 text-sm">
                                Chargement...
                            </div>
                        ) : latestHumidity ? (
                            <>
                                <div className="text-2xl font-bold text-blue-700">
                                    {parseFloat(latestHumidity.data).toFixed(1)}
                                    %
                                </div>
                                <div className="text-xs text-blue-600">
                                    {new Date(
                                        latestHumidity.savedAt
                                    ).toLocaleString("fr-FR")}
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Non disponible
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="text-sm text-green-600 font-medium">
                            Pression
                        </div>
                        {isLoadingPressure ? (
                            <div className="text-gray-500 text-sm">
                                Chargement...
                            </div>
                        ) : latestPressure ? (
                            <>
                                <div className="text-2xl font-bold text-green-700">
                                    {parseFloat(latestPressure.data).toFixed(0)}{" "}
                                    hPa
                                </div>
                                <div className="text-xs text-green-600">
                                    {new Date(
                                        latestPressure.savedAt
                                    ).toLocaleString("fr-FR")}
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Non disponible
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium">
                            Mouvement
                        </div>
                        {isLoadingMovement ? (
                            <div className="text-gray-500 text-sm">
                                Chargement...
                            </div>
                        ) : latestMovement ? (
                            <>
                                <div className="text-2xl font-bold text-purple-700">
                                    {latestMovement.data === "1"
                                        ? "Détecté"
                                        : "Aucun"}
                                </div>
                                <div className="text-xs text-purple-600">
                                    {new Date(
                                        latestMovement.savedAt
                                    ).toLocaleString("fr-FR")}
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Non disponible
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <SensorChart roomId={id} />

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Capteurs installés
                </h2>
                {isLoadingSensors ? (
                    <div className="text-gray-600">
                        Chargement des capteurs...
                    </div>
                ) : sensorsData?.data && sensorsData.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sensorsData.data.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="border rounded-lg p-4 bg-gray-50"
                            >
                                <div className="font-medium text-gray-900 mb-2">
                                    Capteur {sensor.physicalId}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <div>ID: {sensor.id}</div>
                                    <div>ID Physique: {sensor.physicalId}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">Aucun capteur configuré</div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Équipements
                </h2>
                {isLoadingEquipment ? (
                    <div className="text-gray-600">
                        Chargement des équipements...
                    </div>
                ) : equipmentData?.data && equipmentData.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {equipmentData.data.map((equipment) => (
                            <div
                                key={equipment.id}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-gray-900 capitalize">
                                        {equipment.type === "ac"
                                            ? "Climatisation"
                                            : "Chauffage"}
                                    </div>
                                    <div className="flex space-x-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                equipment.isFunctional
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {equipment.isFunctional
                                                ? "Fonctionnel"
                                                : "En panne"}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                equipment.isRunning
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {equipment.isRunning
                                                ? "En marche"
                                                : "Arrêté"}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    ID: {equipment.id}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">Aucun équipement trouvé</div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Signalements
                </h2>
                {isLoadingReports ? (
                    <div className="text-gray-600">
                        Chargement des signalements...
                    </div>
                ) : reportsData?.data && reportsData.data.length > 0 ? (
                    <div className="space-y-4">
                        {reportsData.data.map((report) => (
                            <div
                                key={report.reporting.id}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 mb-1">
                                            {report.reporting.description}
                                        </div>
                                        {report.equipment && (
                                            <div className="text-sm text-gray-600">
                                                Équipement:{" "}
                                                {report.equipment.type === "ac"
                                                    ? "Climatisation"
                                                    : "Chauffage"}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            {new Date(
                                                report.reporting.createdDate
                                            ).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            report.reporting.status ===
                                            "resolved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-orange-100 text-orange-800"
                                        }`}
                                    >
                                        {report.reporting.status === "resolved"
                                            ? "Résolu"
                                            : "En attente"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">
                        Aucun signalement trouvé
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoomDetails;
