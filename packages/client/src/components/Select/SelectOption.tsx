import { cn } from "../../utils/cn";

interface SelectOptionProps {
    label: string;
    value: string;
    selected?: boolean;
    multiple?: boolean;
    onClick: () => void;
}

const SelectOption = ({ label, selected = false, multiple = false, onClick }: SelectOptionProps) => {
    return (
        <div
            className={cn(
                "px-3 py-2 cursor-pointer text-sm transition-colors duration-150",
                selected
                    ? "bg-primary text-white rounded-md"
                    : "text-textSecondary hover:bg-gray-50",
                multiple && selected && "font-medium"
            )}
            onClick={onClick}
        >
            {label}
        </div>
    );
};

export default SelectOption;