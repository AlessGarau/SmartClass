
const PencilIcon = ({ color = "black" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14.5V18H5.5L14.81 8.69L11.31 5.19L2 14.5Z" fill={color} />
        <path d="M17.71 6.04C18.1 5.65 18.1 5.02 17.71 4.63L15.37 2.29C14.98 1.9 14.35 1.9 13.96 2.29L12.13 4.12L15.63 7.62L17.71 6.04Z" fill={color} />
    </svg>
);

export default PencilIcon;
