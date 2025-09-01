export const WaterIcon = ({ color = 'teal' }: { color: string }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C12 2 19 10 19 15a7 7 0 0 1-14 0C5 10 12 2 12 2z" stroke={color} strokeWidth="2" fill="none" />
        <ellipse cx="12" cy="17" rx="3" ry="2" fill={color} />
    </svg>
);