interface TagProps {
    variant: "medium" | "bad" | "excellent";
}

function Tag({ variant }: TagProps) {
    const getStyles = () => {
        switch (variant) {
            case "medium":
                return "bg-orange text-white";
            case "bad":
                return "bg-red text-white";
            case "excellent":
                return "bg-green text-white";
            default:
                return "bg-gray-500 bg-opacity-20 text-white";
        }
    };

    const getText = () => {
        switch (variant) {
            case "bad":
                return "Mauvais";
            case "medium":
                return "Moyen";
            case "excellent":
                return "Excellent";
            default:
                return variant;
        }
    };

    return (
        <div
            className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStyles()}`}
        >
            {getText()}
        </div>
    );
}

export default Tag;
