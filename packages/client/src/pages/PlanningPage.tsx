import Button from "../components/Button/Button";
import PlusIcon from "../assets/icons/add_icon.svg"
import FilterContainer from "../components/FilterContainer/FilterContainer";
import Select from "../components/Select/SelectContainer";

const PlanningPage = () => {
    return <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold">Planning</h1>
                <div className="text-[20px]">
                    Plannifiez et gérer la réservation des classes
                </div>
            </div>
            <Button label="Importer une feuille" icon={PlusIcon} />
        </div>
        <FilterContainer>
            <Select options={[{ label: "Classe", value: "1" }]} name="classe" id="classe" />
            <Select options={[{ label: "Classe", value: "1" }]} name="classe" id="classe" />
        </FilterContainer>
    </div>;
};

export default PlanningPage;