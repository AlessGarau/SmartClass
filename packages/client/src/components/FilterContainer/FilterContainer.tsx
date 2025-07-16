
interface FilterContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

const FilterContainer = ({ children }: FilterContainerProps) => {
    return <div className="flex gap-4 bg-white border border-grayBorder border-solid border-2 p-4 rounded-lg w-full">
        {children}
    </div>;
};

export default FilterContainer;