
interface FilterContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

const FilterContainer = ({ children }: FilterContainerProps) => {
    return <div className="flex flex-col lg:flex-row gap-4 bg-white border border-grayBorder border-solid border-2 p-4 rounded-lg w-full min-h-[85px] lg:h-[85px]">
        {children}
    </div>;
};

export default FilterContainer;