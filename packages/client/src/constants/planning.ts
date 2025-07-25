import type { LegendItem } from '../types/ColorLegend';

export const PLANNING_CONFIG = {
    DAY_START_TIME: "09:00",
    DAY_END_TIME: "17:00",
} as const;

export const PLANNING_LEGEND_ITEMS: LegendItem[] = [
    {
        label: "Disponible",
        colorClass: "bg-greenText",
    },
    {
        label: "Occupée",
        colorClass: "bg-slotFilled",
    }
];
