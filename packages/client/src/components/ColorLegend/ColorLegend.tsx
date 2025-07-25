import React from 'react';
import { cn } from '../../utils/cn';
import type { LegendItem } from '../../types/ColorLegend';

interface ColorLegendProps {
    items: LegendItem[];
    className?: string;
}

const ColorLegend: React.FC<ColorLegendProps> = ({ items, className }) => {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <div
                        className={`w-4 h-4 rounded-full ${item.colorClass}`}
                    />
                    <span className="text-sm text-gray-600">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ColorLegend;