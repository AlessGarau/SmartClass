import { cn } from "../../utils/cn";
import SelectOption from "./SelectOption";

interface SelectProps {
    options: { label: string, value: string }[];
    name: string;
    id: string;
    className?: string;
}

const Select = ({ options, name, id, className }: SelectProps) => {
    return <select name={name} id={id} className={cn("border border-grayBorder border-solid p-2 rounded-md", className)}>
        {options.map((option) => (
            <SelectOption key={option.value} label={option.label} value={option.value} />
        ))}
    </select>;
};

export default Select;