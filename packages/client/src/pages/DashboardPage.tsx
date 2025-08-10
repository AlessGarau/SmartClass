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

const DashboardTestPage = () => {
    const navigate = useNavigate();

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
                    Ensoleillé
                </Card>
                <Card className="flex-1" title="Planning">
                    <Button
                        onClick={() => navigate("/planning")}
                        label="Voir le planning"
                    >
                        Voir le planning
                    </Button>
                </Card>
            </div>
            <div className="flex gap-6 mb-8">
                <Card className="w-[830px]" title="Aperçu de l'état des salles">
                    Ensoleillé
                </Card>
                <Card className="flex-1 h-60" title="Consommation énergétique">
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
