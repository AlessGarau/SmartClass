
const EyeIcon = ({ className = "w-5 h-5", color = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path
            d="M2 12C4.5 7 9 4 12 4C15 4 19.5 7 22 12C19.5 17 15 20 12 20C9 20 4.5 17 2 12Z"
            fill={color}
        />
        <circle cx="12" cy="12" r="5" fill="#fff" />
        <circle cx="12" cy="12" r="3.2" fill={color} />
    </svg>
);

export default EyeIcon;
