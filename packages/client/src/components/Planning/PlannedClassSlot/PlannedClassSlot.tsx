import React from "react";
import { calculateDuration } from "../../../utils/planning";
import { cn } from "../../../utils/cn";
import type { PlannedClass } from "../../../types/Planning";

interface PlannedClassSlotProps {
    plannedClass?: PlannedClass;
    isEmpty?: boolean;
    startTime?: string;
    endTime?: string;
}

const BASE_SLOT_CLASSES = "flex flex-col items-center justify-center p-2 border-2 rounded-md mx-2";

const PlannedClassSlot: React.FC<PlannedClassSlotProps> = ({ plannedClass, isEmpty = false, startTime, endTime }) => {
    const duration = (startTime && endTime) ? calculateDuration(startTime, endTime) :
        (plannedClass ? calculateDuration(plannedClass.startTime, plannedClass.endTime) : 60);

    const flexGrowValue = duration;

    if (isEmpty || !plannedClass) {
        return (
            <div
                className={cn(BASE_SLOT_CLASSES, "bg-lightGreen border-greenBorder")}
                style={{ flexGrow: flexGrowValue }}
            >
                <span className="text-sm font-semibold text-greenText">Disponible</span>
                {startTime && endTime && (
                    <span className="text-xs text-greenText">{startTime} - {endTime}</span>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(BASE_SLOT_CLASSES, "bg-slotFilled/10 border-slotFilled/26")}
            style={{ flexGrow: flexGrowValue }}
        >
            <div className="font-semibold text-sm text-slotFilled">{plannedClass.subject}</div>
            <div className="text-xs text-slotFilled">{plannedClass.teacher}</div>
            <div className="text-xs text-slotFilled">
                {plannedClass.startTime} - {plannedClass.endTime}
            </div>
        </div>
    );
};

export default PlannedClassSlot;