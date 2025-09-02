import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { roomQueryOptions } from "../../api/queryOptions";
import UsersIcon from "../../assets/icons/users.svg";
import type { Room } from "../../types/Room";
import Button from "../Button/Button";
import DeleteIcon from "../Icon/DeleteIcon";
import PencilIcon from "../Icon/PencilIcon";
import Popin from "../Popin/Popin";
import SensorBlock from "./SensorBlock";

interface RoomCardProps {
    room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
    const [isEditSectionOpen, setEditSectionOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: room.name,
        building: room.building,
        floor: room.floor,
        capacity: room.capacity,
    });

    //#region Queries
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        ...roomQueryOptions.updateRoom(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room", "allRooms"] });
            queryClient.invalidateQueries({ queryKey: ["room", "count"] });
            queryClient.invalidateQueries({
                queryKey: ["room", "buildingOptions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["room", "floorOptions"],
            });
            setEditSectionOpen(false);
        },
    });

    const deleteMutation = useMutation({
        ...roomQueryOptions.deleteRoom(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room", "allRooms"] });
            queryClient.invalidateQueries({ queryKey: ["room", "count"] });
            queryClient.invalidateQueries({
                queryKey: ["room", "buildingOptions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["room", "floorOptions"],
            });
        },
    });
    //#endregion

    //#region Sensors
    const getTemperatureStyle = (temp: number) => {
        if (temp <= 18) return { color: "text-blue-600", bg: "bg-blue-50" };
        if (temp >= 26) return { color: "text-red-600", bg: "bg-red-50" };
        return { color: "text-teal-700", bg: "bg-teal-50" };
    };

    const hasTemperature =
        room.temperature !== null && !isNaN(Number(room.temperature));
    const temperatureValue = hasTemperature ? String(room.temperature) : "";
    const temperatureStyle = hasTemperature
        ? getTemperatureStyle(Number(temperatureValue))
        : { color: "text-yellow-700", bg: "bg-yellow-100" };
    const hasHumidity = room.humidity !== null && !isNaN(Number(room.humidity));
    const humidityValue = hasHumidity ? String(room.humidity) : "";
    //#endregion

    //#region Handlers
    const handleEditClick = () => {
        setEditSectionOpen(true);
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            roomId: room.id,
            data: {
                ...editData,
                floor: Number(editData.floor),
                capacity: Number(editData.capacity),
            },
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer cette salle ?")) {
            deleteMutation.mutate(room.id);
        }
    };
    //#endregion

    return (
        <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col gap-4 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                    <div className="font-bold text-base sm:text-lg">
                        {room.name}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                        {room.building + " "}-
                        {room.floor === 0 ? " RDC" : ` Étage ${room.floor}`}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${room.isEnabled ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${room.isEnabled ? "bg-green-500" : "bg-red-500"
                                }`}
                        ></span>
                        {room.isEnabled ? "Disponible" : "Non disponible"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <SensorBlock
                    label="Température"
                    unit={"°C"}
                    hasValue={hasTemperature}
                    value={temperatureValue}
                    color={temperatureStyle.color}
                    bg={temperatureStyle.bg}
                />
                <SensorBlock
                    label="Humidité"
                    unit={"%"}
                    hasValue={hasHumidity}
                    value={humidityValue}
                    color={hasHumidity ? "text-teal-700" : "text-yellow-700"}
                    bg={hasHumidity ? "bg-gray-50" : "bg-yellow-100"}
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                    <img src={UsersIcon} className="text-gray-700 w-4 h-4" />
                    <span className="text-xs sm:text-base">
                        {room.capacity} personnes maximum
                    </span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Link
                    key={room.id}
                    to={`/salles/${room.id}`}
                    className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-primary/80 relative group flex-1 rounded-lg font-semibold transition text-xs sm:text-base"
                >
                    Détails
                </Link>
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<PencilIcon />}
                    onClick={handleEditClick}
                    tooltip="Modifier la salle"
                />
                <Popin
                    open={isEditSectionOpen}
                    title={`Modifier la salle - ${room.name}`}
                    icon={<PencilIcon color="teal" />}
                    onClose={() => setEditSectionOpen(false)}
                    actions={
                        <>
                            <Button
                                type="submit"
                                label={
                                    updateMutation.isPending
                                        ? "Enregistrement..."
                                        : "Enregistrer"
                                }
                                className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={updateMutation.isPending}
                                form={`edit-room-form-${room.id}`}
                            />
                            <Button
                                type="button"
                                label="Annuler"
                                className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                                onClick={() => setEditSectionOpen(false)}
                            />
                        </>
                    }
                >
                    <form
                        id={`edit-room-form-${room.id}`}
                        onSubmit={handleEditSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nom de la salle :
                                </label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        handleEditChange("name", e.target.value)
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required
                                    placeholder="Nom de la salle"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Bâtiment :
                                </label>
                                <input
                                    type="text"
                                    value={editData.building}
                                    onChange={(e) =>
                                        handleEditChange(
                                            "building",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required
                                    placeholder="Nom du bâtiment"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Étage :
                                </label>
                                <input
                                    type="number"
                                    value={editData.floor}
                                    onChange={(e) =>
                                        handleEditChange(
                                            "floor",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required
                                    placeholder="Numéro d'étage"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nombre de personnes max :
                                </label>
                                <input
                                    type="number"
                                    value={editData.capacity}
                                    onChange={(e) =>
                                        handleEditChange(
                                            "capacity",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required
                                    placeholder="Capacité maximale"
                                />
                            </div>
                        </div>
                    </form>
                </Popin>
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                />
            </div>
        </div>
    );
};

export default RoomCard;
