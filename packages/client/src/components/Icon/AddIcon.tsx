export const AddIcon = ({ bgColor = "white", plusColor = "teal", className = "" }: { bgColor?: string, plusColor?: string, className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill={bgColor} />
        <path d="M12 8v8M8 12h8" stroke={plusColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
);