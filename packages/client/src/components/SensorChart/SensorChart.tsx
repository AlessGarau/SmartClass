import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { roomQueryOptions } from "../../api/queryOptions";
import type { DailySensorData } from "../../api/endpoints/room";

interface SensorChartProps {
    roomId: string;
    date?: string;
}

type SensorType = "temperature" | "humidity" | "pressure" | "movement";

const sensorConfig = {
    temperature: {
        label: "Température",
        color: "#ef4444",
        gradient: "url(#temperatureGradient)",
        icon: "🌡️",
    },
    humidity: {
        label: "Humidité",
        color: "#3b82f6",
        gradient: "url(#humidityGradient)",
        icon: "💧",
    },
    pressure: {
        label: "Pression",
        color: "#10b981",
        gradient: "url(#pressureGradient)",
        icon: "🌪️",
    },
    movement: {
        label: "Mouvement",
        color: "#8b5cf6",
        gradient: "url(#movementGradient)",
        icon: "👥",
    },
};

const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    
    try {
        const date = new Date(timestamp);
        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
            return "N/A";
        }
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "N/A";
    }
};

const formatTooltipValue = (value: number, sensorType: SensorType) => {
    if (sensorType === "movement") {
        return value === 1 ? "Détecté" : "Aucun";
    }
    return `${value.toFixed(1)}`;
};

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        color: string;
        payload: {
            unit: string;
            timestamp: string;
        };
    }>;
    sensorType: SensorType;
}

const CustomTooltip = ({ active, payload, sensorType }: TooltipProps) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const unit = payload[0].payload.unit;
        const timestamp = payload[0].payload.timestamp;
        
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-gray-600 text-sm">{`Heure: ${formatTimestamp(timestamp)}`}</p>
                <p className="font-semibold" style={{ color: payload[0].color }}>
                    {`${sensorConfig[sensorType].label}: ${formatTooltipValue(value, sensorType)}${unit}`}
                </p>
            </div>
        );
    }
    return null;
};

const calculateStats = (data: DailySensorData["data"]) => {
    if (!data || data.length === 0) {
        return { min: 0, max: 0, avg: 0, count: 0 };
    }
    
    const values = data.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return {
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        avg: Math.round(avg * 100) / 100,
        count: data.length,
    };
};

export function SensorChart({ roomId, date }: SensorChartProps) {
    const [selectedSensor, setSelectedSensor] = useState<SensorType>("temperature");

    // Queries pour chaque type de capteur
    const { data: temperatureData, isLoading: loadingTemp } = useQuery(
        roomQueryOptions.dailyTemperatureData(roomId, date)
    );
    
    const { data: humidityData, isLoading: loadingHumidity } = useQuery(
        roomQueryOptions.dailyHumidityData(roomId, date)
    );
    
    const { data: pressureData, isLoading: loadingPressure } = useQuery(
        roomQueryOptions.dailyPressureData(roomId, date)
    );
    
    const { data: movementData, isLoading: loadingMovement } = useQuery(
        roomQueryOptions.dailyMovementData(roomId, date)
    );

    // Données actuelles selon le capteur sélectionné
    const getCurrentData = () => {
        switch (selectedSensor) {
            case "temperature":
                return temperatureData?.data;
            case "humidity":
                return humidityData?.data;
            case "pressure":
                return pressureData?.data;
            case "movement":
                return movementData?.data;
            default:
                return undefined;
        }
    };

    const isLoading = () => {
        switch (selectedSensor) {
            case "temperature":
                return loadingTemp;
            case "humidity":
                return loadingHumidity;
            case "pressure":
                return loadingPressure;
            case "movement":
                return loadingMovement;
            default:
                return false;
        }
    };

    const currentData = getCurrentData();
    const currentConfig = sensorConfig[selectedSensor];
    const stats = currentData ? calculateStats(currentData.data) : null;

    // Transformation des données pour le graphique
    const chartData = currentData?.data.map(point => ({
        timestamp: point.timestamp,
        value: point.value,
        time: formatTimestamp(point.timestamp),
        unit: currentData.unit,
    })) || [];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Évolution des capteurs - {new Date(date || new Date()).toLocaleDateString("fr-FR")}
                </h2>
                
                {/* Boutons de sélection des capteurs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(sensorConfig).map(([type, config]) => (
                        <button
                            key={type}
                            onClick={() => setSelectedSensor(type as SensorType)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                selectedSensor === type
                                    ? "text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            style={{
                                backgroundColor: selectedSensor === type ? config.color : undefined,
                            }}
                        >
                            <span>{config.icon}</span>
                            {config.label}
                        </button>
                    ))}
                </div>

                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600">Minimum</div>
                            <div className="font-semibold text-gray-900">
                                {selectedSensor === "movement" 
                                    ? (stats.min === 1 ? "Détecté" : "Aucun")
                                    : `${stats.min}${currentData?.unit}`
                                }
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600">Maximum</div>
                            <div className="font-semibold text-gray-900">
                                {selectedSensor === "movement" 
                                    ? (stats.max === 1 ? "Détecté" : "Aucun")
                                    : `${stats.max}${currentData?.unit}`
                                }
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600">Moyenne</div>
                            <div className="font-semibold text-gray-900">
                                {selectedSensor === "movement" 
                                    ? `${(stats.avg * 100).toFixed(1)}% détection`
                                    : `${stats.avg}${currentData?.unit}`
                                }
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600">Points de données</div>
                            <div className="font-semibold text-gray-900">{stats.count}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Graphique */}
            <div className="h-96">
                {isLoading() ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Chargement des données...</div>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Aucune donnée disponible</div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {selectedSensor === "movement" ? (
                            // Graphique en barres pour les mouvements
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="movementGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="time"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    fontSize={12}
                                    domain={[0, 1]}
                                    tickFormatter={(value) => value === 1 ? "Détecté" : "Aucun"}
                                />
                                <Tooltip 
                                    content={<CustomTooltip sensorType={selectedSensor} />}
                                />
                                <Area
                                    type="stepAfter"
                                    dataKey="value"
                                    stroke={currentConfig.color}
                                    fill={currentConfig.gradient}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        ) : (
                            // Graphique en ligne pour les autres capteurs
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="time"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <Tooltip 
                                    content={<CustomTooltip sensorType={selectedSensor} />}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={currentConfig.color}
                                    strokeWidth={2}
                                    dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
