import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { sensorQueryOptions } from "../api/queryOptions";
import type { DailySensorData } from "../types/Sensor";

function RoomDetailsPage() {
    const { id: roomId } = useParams<{ id: string }>();

    const {
        data: sensorData,
        isLoading,
        error,
    } = useQuery(sensorQueryOptions.dailySensorData(roomId || ""));

    const getLatestSensorValue = (
        sensorType: DailySensorData["sensorType"]
    ) => {
        const sensor = sensorData?.data.find(
            (s) => s.sensorType === sensorType
        );
        if (!sensor || sensor.data.length === 0) return "N/A";

        const latestDataPoint = sensor.data[sensor.data.length - 1];
        return `${latestDataPoint.value} ${sensor.unit}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Sensor data:</h1>
                <p className="text-red-600">
                    Erreur lors de la récupération des données des capteurs
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sensor data:</h1>
            <div className="space-y-2">
                <p className="text-lg">
                    <span className="font-semibold">Temperature :</span>{" "}
                    {getLatestSensorValue("temperature")}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Humidity :</span>{" "}
                    {getLatestSensorValue("humidity")}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Pressure :</span>{" "}
                    {getLatestSensorValue("pressure")}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Movement :</span>{" "}
                    {getLatestSensorValue("movement")}
                </p>
            </div>
        </div>
    );
}

export default RoomDetailsPage;
