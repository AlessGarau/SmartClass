import type { Class } from "../../types/Class";
import ClassRow from "./ClassRow";

interface ClassesContainerProps {
    displayedClasses: Class[];
}

const ClassesContainer: React.FC<ClassesContainerProps> = ({ displayedClasses }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-4/6 min-w-[80px]">NOM</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">NOMBRE D'ÉLÈVES</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedClasses.map((classe) => <ClassRow key={classe.id} classModel={classe} />)}
                </tbody>
            </table>
        </div>
    );
};

export default ClassesContainer;
