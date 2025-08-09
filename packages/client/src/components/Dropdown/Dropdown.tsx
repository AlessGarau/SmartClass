import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
interface DropdownOption {
    value: string | number;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    placeholder?: string;
    value?: string | number;
    onSelect: (option: DropdownOption) => void;
    className?: string;
    buttonClassName?: string;
    disabled?: boolean;
}

function Dropdown({
    options,
    placeholder = "Sélectionner une option",
    value,
    onSelect,
    className,
    buttonClassName,
    disabled = false,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
        null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (value !== undefined) {
            const option = options.find(opt => opt.value === value);
            setSelectedOption(option || null);
        }
    }, [value, options]);

    const handleOptionClick = (option: DropdownOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
    };

    return (
        <div ref={dropdownRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full px-4 py-2 text-left bg-white border-2 border-grayBorder rounded-xl focus:outline-none flex justify-between items-center",
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                    buttonClassName
                )}
            >
                <span className="text-gray-900">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => handleOptionClick(option)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
