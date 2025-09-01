import WarningIcon from "../../assets/icons/warning.svg";
import type { RoomSensorBlock } from "../../types/Room";
import { TemperatureIcon } from "../Icon/TemperatureIcon";
import { WaterIcon } from "../Icon/WaterIcon";

const SensorBlock = ({ label, value, hasValue, icon, color, bg, unit }: RoomSensorBlock) => {
    const iconColor = color.split("-")[1];
    let iconElement;
    if (!hasValue) {
        iconElement = <img src={WarningIcon} className="w-4 h-4 text-yellow-700" />;
    } else if (label === "Température") {
        iconElement = <TemperatureIcon color={iconColor} />;
    } else if (label === "Humidité") {
        iconElement = <WaterIcon color={iconColor} />;
    } else {
        iconElement = <img src={icon} className={`w-4 h-4`} />;
    }
    return (
        <div className={`flex-1 min-w-0 ${bg} rounded-lg p-2 flex flex-col items-start`}>
            <div className={`flex items-center gap-1 ${color} text-xs font-semibold truncate overflow-hidden w-full`}>
                {iconElement}
                {label}
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${color} truncate overflow-hidden w-full`}>
                {hasValue ? value + unit : `--${unit}`}
            </div>
        </div>
    );
};

export default SensorBlock;
