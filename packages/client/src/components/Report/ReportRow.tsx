import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { reportQueryOptions } from "../../api/queryOptions";
import type { Report, ReportUpdate } from "../../types/Reports";
import Button from "../Button/Button";
import DeleteIcon from "../Icon/DeleteIcon";
import EyeIcon from "../Icon/EyeIcon";
import PencilIcon from "../Icon/PencilIcon";
import Popin from "../Popin/Popin";

interface ReportRowProps {
    report: Report;
}

const ReportRow = ({ report }: ReportRowProps) => {
    const [isEditSectionOpen, setEditSectionOpen] = useState(false);
    const [editData, setEditData] = useState<ReportUpdate>({
        status: report.status,
        description: report.description,
    });
    const [isDescOpen, setIsDescOpen] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const descRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (descRef.current) {
            setIsTruncated(descRef.current.scrollWidth > descRef.current.clientWidth);
        }
    }, [report.description]);

    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        ...reportQueryOptions.updateReport(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["report", "allReports"] });
            queryClient.invalidateQueries({ queryKey: ["report", "count"] });
            setEditSectionOpen(false);
        },
    });
    const deleteMutation = useMutation({
        ...reportQueryOptions.deleteReport(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['report', 'allReports'] });
            queryClient.invalidateQueries({ queryKey: ['report', 'count'] });
        },
    });

    const statusOptions = [
        { label: "Tous les états", value: "" },
        { label: "En cours", value: "pending" },
        { label: "Résolu", value: "resolved" }
    ];

    const handleOpenDesc = () => setIsDescOpen(true);
    const handleCloseDesc = () => setIsDescOpen(false);

    const handleEditClick = () => {
        setEditSectionOpen(true);
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            reportId: report.id,
            data: {
                ...editData,
            },
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce signalement ?")) {
            deleteMutation.mutate(report.id);
        }
    };

    return (
        <tr key={report.id} className="border-b last:border-none">
            <td className="px-2 py-2 font-medium text-gray-700 break-words max-w-[100px]">{report.roomName}</td>
            <td className="px-2 py-2 text-gray-700 break-words max-w-[100px]">{report.equipmentType}</td>
            <td className="px-2 py-2 text-gray-700 max-w-[180px] truncate relative">
                <div className="flex items-center gap-2">
                    <span ref={descRef} className="truncate block max-w-[120px]">{report.description}</span>
                    {isTruncated && (
                        <Button
                            className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                            iconTSX={<EyeIcon />}
                            onClick={handleOpenDesc}
                            tooltip="Voir plus"
                        />
                    )}
                    <Popin
                        open={isDescOpen}
                        title="Description complète"
                        icon={<EyeIcon color="teal" />}
                        onClose={handleCloseDesc}
                        actions={
                            <Button
                                type="button"
                                label="Fermer"
                                className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                                onClick={handleCloseDesc}
                            />
                        }
                    >
                        <div className="text-gray-700 break-words whitespace-pre-line mb-4">{report.description}</div>
                    </Popin>
                </div>
            </td>
            <td className="px-2 py-2">
                {report.status === "pending" ? (
                    <span className="text-blue-600 font-semibold">En cours</span>
                ) : (
                    <span className="text-green-600 font-semibold">Résolu</span>
                )}
            </td>
            <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{new Date(report.createdDate).toLocaleDateString("fr-FR")}</td>
            <td className="px-2 py-2 flex gap-2">
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<PencilIcon />}
                    onClick={handleEditClick}
                    tooltip="Modifier le signalement"
                />
                <Popin
                    open={isEditSectionOpen}
                    title={`Modifier le signalement - ${report.id}`}
                    icon={<PencilIcon color="teal" />}
                    onClose={() => setEditSectionOpen(false)}
                    actions={
                        <>
                            <Button
                                type="submit"
                                label={
                                    updateMutation.isPending
                                        ? "Enregistrement..."
                                        : "Enregistrer"
                                }
                                className="text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={updateMutation.isPending}
                                form={`edit-report-form-${report.id}`}
                            />
                            <Button
                                type="button"
                                label="Annuler"
                                className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                                onClick={() => setEditSectionOpen(false)}
                            />
                        </>
                    }
                >
                    <form
                        id={`edit-report-form-${report.id}`}
                        onSubmit={handleEditSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    État du signalement:
                                </label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => handleEditChange("status", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required
                                >
                                    {statusOptions
                                        .filter(option => option.value !== "")
                                        .map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Description du signalement:
                                </label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Description du signalement"
                                />
                            </div>
                        </div>
                    </form>
                </Popin>
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                />
            </td>
        </tr>
    )
}

export default ReportRow;
