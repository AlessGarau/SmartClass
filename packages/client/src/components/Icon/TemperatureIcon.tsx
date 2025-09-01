export const TemperatureIcon = ({ color = "teal" }: { color?: string }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a2 2 0 0 1 2 2v10.28a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2z" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="12" cy="18" r="2" fill={color} />
    </svg>
);