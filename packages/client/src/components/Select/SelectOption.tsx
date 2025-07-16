interface SelectOptionProps {
    label: string;
    value: string;
}

const SelectOption = ({ label, value }: SelectOptionProps) => {
    return <option className="text-textSecondary bg-white" value={value}>{label}</option>;
};

export default SelectOption;