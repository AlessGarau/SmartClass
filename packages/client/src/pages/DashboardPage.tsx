import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import greenDoor from "../assets/icons/greenDoor_icon.jpg";
import blueSpark from "../assets/icons/blueSpark_icon.jpg";
import temp from "../assets/icons/temp_icon.jpg";
import greenStar from "../assets/icons/greenStar_icon.jpg";
import plusIcon from "../assets/icons/plus_icon.jpg";
import planningIcon from "../assets/icons/planning_icon.jpg";
import alertIcon from "../assets/icons/alert_icon.jpg";
import settingsIcon from "../assets/icons/settings_icon.jpg";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { weatherQueryOptions, roomQueryOptions } from "../api/queryOptions";

const DashboardTestPage = () => {
    const navigate = useNavigate();

    const { data: weatherResponse } = useQuery(
        weatherQueryOptions.weeklyWeather()
    );

    const { data: roomsResponse } = useQuery(
        roomQueryOptions.roomsWithStatus()
    );

    const getWeekdayWeather = () => {
        if (!weatherResponse?.data) return [];

        const today = new Date();
        const weekdays = [];

        const monday = new Date(today);
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(today.getDate() + daysToMonday);

        for (let i = 0; i < 5; i++) {
            const currentDay = new Date(monday);
            currentDay.setDate(monday.getDate() + i);
            const dateString = currentDay.toISOString().split("T")[0];

            const weatherData = weatherResponse.data.find(
                (weather) => weather.date === dateString
            );
            if (weatherData) {
                weekdays.push({
                    ...weatherData,
                    dayName:
                        currentDay
                            .toLocaleDateString("fr-FR", { weekday: "short" })
                            .charAt(0)
                            .toUpperCase() +
                        currentDay
                            .toLocaleDateString("fr-FR", { weekday: "short" })
                            .slice(1),
                });
            }
        }

        return weekdays;
    };

    const weekdayWeather = getWeekdayWeather();

    return (
        <div className="flex flex-col p-8 max-w-7xl mx-auto">
            <div className="flex gap-6 mb-8">
                <Card className="max-w-72 w-full flex items-center">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-textSecondary font-[500] text-sm">
                                Salles Actives
                            </h1>
                            <p className="text-2xl font-extrabold text-gray-800">
                                24/30
                            </p>
                        </div>
                        <img
                            className="w-12 h-12"
                            src={greenDoor}
                            alt="Icône salle active"
                        />
                    </div>
                </Card>
                <Card className="max-w-72 w-full flex items-center">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-textSecondary font-[500] text-sm">
                                Efficacité énergétique
                            </h1>
                            <p className="text-2xl font-extrabold text-gray-800">
                                87%
                            </p>
                        </div>
                        <img
                            className="w-12 h-12"
                            src={blueSpark}
                            alt="Icône salle active"
                        />
                    </div>
                </Card>
                <Card className="max-w-72 w-full flex items-center">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-textSecondary font-[500] text-sm">
                                Temp. Moyenne
                            </h1>
                            <p className="text-2xl font-extrabold text-gray-800">
                                22°C
                            </p>
                        </div>
                        <img
                            className="w-12 h-12"
                            src={temp}
                            alt="Icône salle active"
                        />
                    </div>
                </Card>
                <Card className="max-w-72 w-full flex items-center">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-textSecondary font-[500] text-sm">
                                Score de confort
                            </h1>
                            <p className="text-2xl font-extrabold text-gray-800">
                                4.2/5
                            </p>
                        </div>
                        <img
                            className="w-12 h-12"
                            src={greenStar}
                            alt="Icône salle active"
                        />
                    </div>
                </Card>
            </div>
            <div className="flex gap-6 mb-8 w-full">
                <Card className="w-[830px]" title="Météo de la semaine">
                    {weatherResponse ? (
                        <div className="flex gap-4 mt-4">
                            {weekdayWeather.map((weather) => (
                                <div
                                    key={weather.date}
                                    className="flex flex-col items-center flex-1 px-3 py-8 bg-gray-50 rounded-lg"
                                >
                                    <div className="text-sm font-semibold text-gray-700 mb-2">
                                        {weather.dayName}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        {new Date(
                                            weather.date
                                        ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </div>
                                    <div className="text-2xl mb-1">
                                        {weather.condition === "clear" && "☀️"}
                                        {weather.condition ===
                                            "partly_cloudy" && "⛅"}
                                        {weather.condition === "cloudy" && "☁️"}
                                        {weather.condition === "rainy" && "🌧️"}
                                        {weather.condition === "snowy" && "❄️"}
                                        {![
                                            "clear",
                                            "partly_cloudy",
                                            "cloudy",
                                            "rainy",
                                            "snowy",
                                        ].includes(weather.condition) && "🌤️"}
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-800">
                                            {weather.temperatureMax}°
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {weather.temperatureMin}°
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {weekdayWeather.length === 0 && (
                                <div className="flex items-center justify-center w-full h-24 text-gray-500">
                                    Données météo non disponibles
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-24">
                            <div className="text-gray-500">
                                Chargement de la météo...
                            </div>
                        </div>
                    )}
                </Card>
                <Card className="flex-1" title="Planning">
                    <div className="bg-lightRed border-2 border-red flex flex-col justify-center items-center p-3 rounded-lg">
                        <span className="text-sm font-semibold text-red">
                            Mathématiques
                        </span>

                        <span className="text-xs text-red">9:00 - 17:00</span>
                    </div>
                    <div className="bg-lightGreen border-2 border-greenBorder flex flex-col justify-center items-center p-3 rounded-lg my-4">
                        <span className="text-sm font-semibold text-greenText">
                            Disponible
                        </span>

                        <span className="text-xs text-greenText">
                            9:00 - 17:00
                        </span>
                    </div>

                    <Button
                        className="w-full flex justify-center"
                        onClick={() => navigate("/planning")}
                        label="Voir le planning"
                    >
                        Voir le planning
                    </Button>
                </Card>
            </div>
            <div className="flex gap-6 mb-8">
                <Card
                    className="w-[830px] relative"
                    title="Aperçu de l'état des classes"
                >
                    <button
                        onClick={() => {
                            navigate("/salles");
                        }}
                        className="absolute top-6 right-6 text-blue-500 hover:underline text-sm cursor-pointer"
                    >
                        Voir tout
                    </button>

                    {roomsResponse?.data ? (
                        <div className="flex gap-4 overflow-x-auto">
                            {roomsResponse.data.slice(0, 2).map((room) => (
                                <div
                                    key={room.id}
                                    className="min-w-80 w-full bg-white border border-gray-200 rounded-lg p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {room.name}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                room.status === "optimal"
                                                    ? "bg-green-100 text-green-700"
                                                    : room.status === "alert"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {room.status === "optimal" &&
                                                "Optimal"}
                                            {room.status === "alert" && "Alert"}
                                            {room.status === "inactive" &&
                                                "Inactif"}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Température :</span>
                                            <span className="font-medium text-gray-800">
                                                {room.temperature}°C
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Humidité :</span>
                                            <span className="font-medium text-gray-800">
                                                {room.humidity}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Capacité :</span>
                                            <span className="font-medium text-gray-800">
                                                {room.occupancy || 0}/
                                                {room.capacity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!roomsResponse.data ||
                                roomsResponse.data.length === 0) && (
                                <div className="flex items-center justify-center w-full h-32 text-gray-500">
                                    Aucune donnée de salle disponible
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-gray-500">
                                Chargement des salles...
                            </div>
                        </div>
                    )}
                </Card>
                <Card className="flex-1" title="Consommation énergétique">
                    <p className="text-lg text-primary mt-12 font-semibold">
                        Aujourd'hui
                    </p>
                    <p className="text-5xl mt-2 font-bold">150 kWh</p>
                </Card>
            </div>
            <div className="flex">
                <Card className="w-full max-w-96" title="Actions rapides">
                    <div className="flex items-center gap-4 mb-6 mt-8">
                        <img
                            className="w-4 h-4"
                            src={plusIcon}
                            alt="Icône action rapide"
                        />
                        <button
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate("/salles")}
                        >
                            Ajouter une classe
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            className="w-4 h-4"
                            src={planningIcon}
                            alt="Icône planning"
                        />
                        <button
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate("/planning")}
                        >
                            Voir le planning
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            className="w-4 h-4"
                            src={alertIcon}
                            alt="Icône alertes"
                        />
                        <button
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate("/alertes")}
                        >
                            Voir les alertes
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <img
                            className="w-4 h-4"
                            src={settingsIcon}
                            alt="Icône paramètres"
                        />
                        <button
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate("/parametres")}
                        >
                            Paramètres
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardTestPage;
