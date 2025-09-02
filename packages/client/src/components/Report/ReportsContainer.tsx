
import type { Report } from "../../types/Reports";
import ReportRow from "./ReportRow";

interface ReportsContainerProps {
    displayedReports: Report[];
}

const ReportsContainer: React.FC<ReportsContainerProps> = ({ displayedReports }: ReportsContainerProps) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">SALLE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-2/6 min-w-[120px]">DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">ÉTAT</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-1/6 min-w-[80px]">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedReports.map((report) => <ReportRow key={report.id} report={report} />)}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsContainer;