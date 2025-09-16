import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { classQueryOptions } from "../../api/queryOptions";
import type { Class, ClassUpdate } from "../../types/Class";
import Button from "../Button/Button";
import DeleteIcon from "../Icon/DeleteIcon";
import PencilIcon from "../Icon/PencilIcon";
import Popin from "../Popin/Popin";

interface ClassRowProps {
    classModel: Class;
}

const ClassRow = ({ classModel }: ClassRowProps) => {
    const [isEditSectionOpen, setEditSectionOpen] = useState(false);
    const [editData, setEditData] = useState<ClassUpdate>({
        name: classModel.name,
        studentCount: classModel.studentCount,
    });

    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        ...classQueryOptions.updateClass(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class", "allClasses"] });
            queryClient.invalidateQueries({ queryKey: ["class", "count"] });
            setEditSectionOpen(false);
        },
    });
    const deleteMutation = useMutation({
        ...classQueryOptions.deleteClass(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['class', 'allClasses'] });
            queryClient.invalidateQueries({ queryKey: ['class', 'count'] });
        },
    });

    const handleEditClick = () => {
        setEditSectionOpen(true);
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            classId: classModel.id,
            data: {
                ...editData,
            },
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer cette promotion ?")) {
            deleteMutation.mutate(classModel.id);
        }
    };

    return (
        <tr key={classModel.id} className="border-b last:border-none">
            <td className="px-2 py-2 font-medium text-gray-700 break-words max-w-[100px]">{classModel.name}</td>
            <td className="px-2 py-2 text-gray-700 break-words max-w-[100px]">{classModel.studentCount}</td>
            <td className="px-2 py-2 flex gap-2">
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<PencilIcon />}
                    onClick={handleEditClick}
                    tooltip="Modifier la promotion"
                />
                <Popin
                    open={isEditSectionOpen}
                    title={`Modifier la promotion - ${classModel.id}`}
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
                                form={`edit-class-form-${classModel.id}`}
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
                        id={`edit-class-form-${classModel.id}`}
                        onSubmit={handleEditSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nom de la promotion:
                                </label>
                                <input
                                    value={editData.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Nom de la promotion"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nombre d'élèves de la promotion:
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={editData.studentCount}
                                    onChange={(e) => handleEditChange("studentCount", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Nombre d'élèves de la promotion"
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

export default ClassRow;
