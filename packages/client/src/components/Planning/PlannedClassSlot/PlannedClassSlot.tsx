import React from "react";
import { calculateDuration } from "../../../utils/planning";

interface PlannedClass {
    id: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: string;
}

interface PlannedClassSlotProps {
    plannedClass?: PlannedClass;
    isEmpty?: boolean;
    startTime?: string;
    endTime?: string;
}

const PlannedClassSlot: React.FC<PlannedClassSlotProps> = ({ plannedClass, isEmpty = false, startTime, endTime }) => {
    const duration = (startTime && endTime) ? calculateDuration(startTime, endTime) :
        (plannedClass ? calculateDuration(plannedClass.startTime, plannedClass.endTime) : 60);

    const flexGrowValue = duration;

    if (isEmpty || !plannedClass) {
        return (
            <div
                className="flex flex-col items-center justify-center p-2 bg-lightGreen border border-greenBorder border-2 rounded-md mx-2"
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
            className="flex flex-col items-center justify-center p-2 bg-slotFilled/10 border border-slotFilled/26 border-2 rounded-md mx-2"
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