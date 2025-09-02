import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import type {
    DailySensorData,
    SensorDataPoint,
} from "../../api/endpoints/sensor";

interface SensorChartProps {
    sensorData: DailySensorData[];
    isLoading?: boolean;
}

type SensorType = "temperature" | "humidity" | "pressure";

interface SensorConfig {
    type: SensorType;
    label: string;
    unit: string;
    color: string;
    bgColor: string;
}

const sensorConfigs: SensorConfig[] = [
    {
        type: "temperature",
        label: "Température",
        unit: "°C",
        color: "#059669",
        bgColor: "bg-green-100 text-green-700",
    },
    {
        type: "humidity",
        label: "Humidité",
        unit: "%",
        color: "#0ea5e9",
        bgColor: "bg-blue-100 text-blue-700",
    },
    {
        type: "pressure",
        label: "Pression",
        unit: "hPa",
        color: "#7c3aed",
        bgColor: "bg-purple-100 text-purple-700",
    },
];

const SensorChart: React.FC<SensorChartProps> = ({ sensorData, isLoading }) => {
    const [selectedSensor, setSelectedSensor] =
        useState<SensorType>("temperature");

    const currentSensorData = sensorData?.find(
        (sensor) => sensor.sensorType === selectedSensor
    );
    const rawData = currentSensorData?.data || [];

    const data = rawData.filter(
        (point) =>
            point &&
            !isNaN(point.value) &&
            isFinite(point.value) &&
            point.timestamp &&
            !isNaN(new Date(point.timestamp).getTime())
    );

    const currentConfig = sensorConfigs.find(
        (config) => config.type === selectedSensor
    )!;

    const chartData = data.map((point: SensorDataPoint) => ({
        time: format(new Date(point.timestamp), "HH:mm", { locale: fr }),
        fullTime: format(new Date(point.timestamp), "HH:mm:ss dd/MM", {
            locale: fr,
        }),
        value: Math.round(point.value * 10) / 10, 
    }));

    if (isLoading) {
        return (
            <div className="w-full h-80 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                <div className="text-gray-500">Chargement des données...</div>
            </div>
        );
    }

    const hasData = data && data.length > 0;
    let stats = null;
    if (hasData) {
        const values = data.map((d) => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue =
            values.reduce((sum, val) => sum + val, 0) / values.length;

        stats = {
            min: Math.round(minValue * 10) / 10,
            max: Math.round(maxValue * 10) / 10,
            avg: Math.round(avgValue * 10) / 10,
            count: data.length,
        };
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Paramètres environnementaux
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                    {sensorConfigs.map((config) => {
                        const isActive = selectedSensor === config.type;
                        return (
                            <button
                                key={config.type}
                                onClick={() => setSelectedSensor(config.type)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                    isActive
                                        ? config.bgColor
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {config.label}
                            </button>
                        );
                    })}
                </div>

                {hasData && stats && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Min:</span>{" "}
                            {stats.min}
                            {currentConfig.unit}
                        </div>
                        <div>
                            <span className="font-medium">Max:</span>{" "}
                            {stats.max}
                            {currentConfig.unit}
                        </div>
                        <div>
                            <span className="font-medium">Moyenne:</span>{" "}
                            {stats.avg}
                            {currentConfig.unit}
                        </div>
                        <div>
                            <span className="font-medium">Relevés:</span>{" "}
                            {stats.count}
                        </div>
                    </div>
                )}
            </div>

            {hasData ? (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="time"
                                stroke="#666"
                                fontSize={12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                domain={["dataMin - 1", "dataMax + 1"]}
                                label={{
                                    value: `${currentConfig.label} (${currentConfig.unit})`,
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                }}
                                formatter={(value: number) => [
                                    `${value}${currentConfig.unit}`,
                                    currentConfig.label,
                                ]}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={currentConfig.color}
                                strokeWidth={2}
                                dot={{
                                    fill: currentConfig.color,
                                    strokeWidth: 2,
                                    r: 4,
                                }}
                                activeDot={{
                                    r: 6,
                                    stroke: currentConfig.color,
                                    strokeWidth: 2,
                                }}
                                name={currentConfig.label}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                    Aucune donnée de {currentConfig.label.toLowerCase()}{" "}
                    disponible pour aujourd'hui
                </div>
            )}
        </div>
    );
};

export default SensorChart;
