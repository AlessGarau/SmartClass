import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
import SelectOption from "./SelectOption";
import ExpandArrowIcon from "../../assets/icons/expand_arrow.svg";

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    className?: string;
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    multiple?: boolean;
    disabled?: boolean;
    maxHeight?: string;
    label?: string;
}

const Select = ({
    options,
    className,
    value,
    onChange,
    placeholder = "Select an option",
    multiple = false,
    disabled = false,
    maxHeight = "300px",
    label
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(() => {
        if (multiple) {
            if (Array.isArray(value)) {
                return value as string[];
            }
            return value ? [value as string] : [];
        }
        return value ? [value as string] : [];
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (multiple) {
            const newValues = Array.isArray(value) ? (value as string[]) : value ? [value as string] : [];
            setSelectedValues(newValues);
        } else {
            const newValues = value ? [value as string] : [];
            setSelectedValues(newValues);
        }
    }, [value, multiple]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = useCallback((optionValue: string) => {
        if (disabled) return;

        let newValues: string[];

        const isSelected = selectedValues.includes(optionValue);
        if (multiple) {
            newValues = isSelected
                ? selectedValues.filter(v => v !== optionValue)
                : [...selectedValues, optionValue];
        } else {
            newValues = isSelected
                ? []
                : [optionValue];
            setIsOpen(false);
        }

        setSelectedValues(newValues);
        onChange?.(multiple ? newValues : newValues[0]);
    }, [selectedValues, multiple, onChange, disabled]);

    const handleToggle = useCallback(() => {
        if (disabled) return;
        setIsOpen(!isOpen);
    }, [isOpen, disabled]);

    const getDisplayText = () => {
        if (selectedValues.length === 0) return placeholder;

        if (multiple) {
            if (selectedValues.length === 1) {
                const option = options.find(opt => opt.value === selectedValues[0]);
                return option?.label || selectedValues[0];
            }
            return `${selectedValues.length} sélectionnés`;
        }

        const option = options.find(opt => opt.value === selectedValues[0]);
        return option?.label || selectedValues[0];
    };

    const isOptionSelected = (optionValue: string) => {
        return selectedValues.includes(optionValue);
    };

    return (
        <div className="flex gap-2 items-center font-semibold">
            {label && <span className="text-textSecondary">{label} : </span>}
            <div
                ref={containerRef}
                className={cn(
                    "relative border border-grayBorder border-solid border-2 rounded-md w-[180px]",
                    disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer",
                    className
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-between px-3 h-10",
                        disabled ? "text-gray-400" : "text-textSecondary hover:bg-gray-50"
                    )}
                    onClick={handleToggle}
                >

                    <span className="truncate">{getDisplayText()}</span>
                    <img src={ExpandArrowIcon} alt="Expand" className={cn(
                        "ml-2 w-4 h-4 transition-transform duration-200",
                        isOpen ? "rotate-180" : ""
                    )} />

                </div>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border border-grayBorder border-solid rounded-md mt-1 z-10 shadow-lg"
                    >
                        <div className="overflow-y-auto relative" style={{ maxHeight }}>
                            {options.length > 7 && (
                                <div className="sticky top-0 h-2 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none z-10" />
                            )}
                            {options.map((option) => (
                                <SelectOption
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                    selected={isOptionSelected(option.value)}
                                    multiple={multiple}
                                    onClick={() => handleOptionClick(option.value)}
                                />
                            ))}
                            {options.length > 7 && (
                                <div className="sticky bottom-0 h-2 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none z-10" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;