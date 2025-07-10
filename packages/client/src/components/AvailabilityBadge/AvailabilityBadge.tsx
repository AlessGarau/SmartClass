interface AvailabilityBadgeProps {
    status: "available" | "busy";
    label?: string;
}

const statusConfig = {
    available: {
        color: "bg-green",
        text: "text-green",
        label: "Disponible",
    },
    busy: {
        color: "bg-red",
        text: "text-red",
        label: "Occupé",
    },
};

export const AvailabilityBadge = ({
    status,
    label,
}: AvailabilityBadgeProps) => {
    const config = statusConfig[status];
    const { color, text, label: defaultLabel } = config;

    return (
        <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full font-medium text-xs ${text} font-sans`}
        >
            <span
                className={`inline-block w-3 h-3 rounded-full mr-1 ${color}`}
            />
            {label || defaultLabel}
        </span>
    );
};

export default AvailabilityBadge;
