import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { teacherQueryOptions } from "../../api/queryOptions";
import type { Teacher, TeacherUpdate } from "../../types/Teacher";
import Button from "../Button/Button";
import DeleteIcon from "../Icon/DeleteIcon";
import PencilIcon from "../Icon/PencilIcon";
import Popin from "../Popin/Popin";

interface TeacherRowProps {
    teacherModel: Teacher;
}

const TeacherRow = ({ teacherModel }: TeacherRowProps) => {
    const [isEditSectionOpen, setEditSectionOpen] = useState(false);
    const [editData, setEditData] = useState<TeacherUpdate>({
        email: teacherModel.email,
        firstName: teacherModel.firstName,
        lastName: teacherModel.lastName,
    });

    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        ...teacherQueryOptions.updateTeacher(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher", "allTeachers"] });
            queryClient.invalidateQueries({ queryKey: ["teacher", "count"] });
            setEditSectionOpen(false);
        },
    });
    const deleteMutation = useMutation({
        ...teacherQueryOptions.deleteTeacher(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher', 'allTeachers'] });
            queryClient.invalidateQueries({ queryKey: ['teacher', 'count'] });
        },
    });

    const handleEditClick = () => {
        setEditSectionOpen(true);
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            teacherId: teacherModel.id,
            data: {
                ...editData,
            },
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
            deleteMutation.mutate(teacherModel.id);
        }
    };

    return (
        <tr key={teacherModel.id} className="border-b last:border-none">
            <td className="px-2 py-2 font-medium text-gray-700 break-words max-w-[100px]">{teacherModel.email}</td>
            <td className="px-2 py-2 text-gray-700 break-words max-w-[100px]">{teacherModel.firstName}</td>
            <td className="px-2 py-2 text-gray-700 break-words max-w-[100px]">{teacherModel.lastName}</td>
            <td className="px-2 py-2 flex gap-2">
                <Button
                    className="bg-gray-100 justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 transition text-xs sm:text-base"
                    iconTSX={<PencilIcon />}
                    onClick={handleEditClick}
                    tooltip="Modifier l'enseignant"
                />
                <Popin
                    open={isEditSectionOpen}
                    title={`Modifier l'enseignant - ${teacherModel.id}`}
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
                                form={`edit-class-form-${teacherModel.id}`}
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
                        id={`edit-class-form-${teacherModel.id}`}
                        onSubmit={handleEditSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Email :
                                </label>
                                <input
                                    value={editData.email}
                                    onChange={(e) => handleEditChange("email", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Email de l'enseignant"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Prénom :
                                </label>
                                <input
                                    value={editData.firstName}
                                    onChange={(e) => handleEditChange("firstName", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Prénom de l'enseignant"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nom :
                                </label>
                                <input
                                    type="text"
                                    value={editData.lastName}
                                    onChange={(e) => handleEditChange("lastName", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none min-h-[60px]"
                                    required
                                    placeholder="Nom de l'enseignant"
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

export default TeacherRow;
