import React from "react";
import Button from "../../Button/Button";
import { getCurrentWeekNumber, getWeeksInYear } from "../../../utils/dates";

interface WeekSelectorProps {
    currentWeekNumber: number;
    currentYear: number;
    onWeekChange: (weekNumber: number, year: number) => void;
}

const WeekSelector = ({ currentWeekNumber, currentYear, onWeekChange }: WeekSelectorProps) => {
    const handlePreviousWeek = () => {
        if (currentWeekNumber > 1) {
            onWeekChange(currentWeekNumber - 1, currentYear);
        } else {
            const previousYear = currentYear - 1;
            const weeksInPreviousYear = getWeeksInYear(previousYear);
            onWeekChange(weeksInPreviousYear, previousYear);
        }
    };

    const handleNextWeek = () => {
        const weeksInCurrentYear = getWeeksInYear(currentYear);
        if (currentWeekNumber < weeksInCurrentYear) {
            onWeekChange(currentWeekNumber + 1, currentYear);
        } else {
            onWeekChange(1, currentYear + 1);
        }
    };

    const handleCurrentWeek = () => {
        const now = new Date();
        const currentWeek = getCurrentWeekNumber();
        const currentYear = now.getFullYear();
        onWeekChange(currentWeek, currentYear);
    };

    return (
        <div className="flex items-center justify-between w-full mb-4">
            <Button
                label="Semaine précédente"
                onClick={handlePreviousWeek}
                className="px-3 py-1 text-white rounded"
            />

            <div className="flex items-center gap-2">
                <span className="font-semibold">Semaine {currentWeekNumber} - {currentYear}</span>
                <Button
                    label="Cette semaine"
                    onClick={handleCurrentWeek}
                    className="px-2 py-1 text-white rounded text-sm"
                />
            </div>

            <Button
                label="Semaine suivante"
                onClick={handleNextWeek}
                className="px-3 py-1 text-white rounded"
            />
        </div>
    );
};

export default WeekSelector;