
interface FilterContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

const FilterContainer = ({ children }: FilterContainerProps) => {
    return (
        <div className="flex flex-col w-full gap-2 sm:flex-row sm:flex-wrap sm:gap-4 bg-white border border-grayBorder border-solid border-2 p-4 rounded-lg min-h-[85px] overflow-x-auto lg:overflow-visible scrollbar-thin scrollbar-thumb-gray-300">
            {children}
        </div>
    );
};

export default FilterContainer;