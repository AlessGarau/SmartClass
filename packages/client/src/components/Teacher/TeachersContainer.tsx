import type { Teacher } from "../../types/Teacher";
import TeacherRow from "./TeacherRow";

interface TeachersContainerProps {
    displayedTeachers: Teacher[];
}

const TeachersContainer: React.FC<TeachersContainerProps> = ({ displayedTeachers }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-4/6 min-w-[80px]">NOM</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">PRÉNOM</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">EMAIL</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedTeachers.map((teacher) => <TeacherRow key={teacher.id} teacherModel={teacher} />)}
                </tbody>
            </table>
        </div>
    );
};

export default TeachersContainer;
