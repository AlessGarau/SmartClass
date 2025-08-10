import React, { useState, useEffect } from "react";
import type { PlannedClass } from "../../../types/Planning";
import Button from "../../Button/Button";
import Dropdown from "../../Dropdown/Dropdown";
import Input from "../../Input/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryOptions, lessonQueryOptions } from "../../../api/queryOptions";
import toast from "react-hot-toast";

interface LessonDetailsModalProps {
    lesson: PlannedClass;
    isOpen: boolean;
    onClose: () => void;
}

const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({ lesson, isOpen, onClose }) => {
    const [formData, setFormData] = useState<PlannedClass>(lesson);
    const [hasChanges, setHasChanges] = useState(false);
    const queryClient = useQueryClient();

    const { data: teacherOptionsData } = useQuery(userQueryOptions.teacherOptions());

    const updateLessonMutation = useMutation({
        ...lessonQueryOptions.updateLesson(),
        onSuccess: () => {
            toast.success('Cours mis à jour avec succès');
            queryClient.invalidateQueries({ queryKey: ['planning'] });
            setHasChanges(false);
            onClose();
        },
        onError: (error) => {
            console.error('Error updating lesson:', error);
            toast.error('Erreur lors de la mise à jour du cours');
        }
    });

    useEffect(() => {
        setFormData(lesson);
        setHasChanges(false);
    }, [lesson]);

    const selectedTeacherId = teacherOptionsData?.data?.find(
        option => option.label === formData.teacher
    )?.value || "";

    const handleChange = (field: keyof PlannedClass, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasChanges) return;

        if (!selectedTeacherId) {
            toast.error('Veuillez sélectionner un professeur');
            return;
        }
        const dataToSend = {
            ...formData,
            teacher: selectedTeacherId as string
        };

        updateLessonMutation.mutate(dataToSend);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Détails du cours</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Matière"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Professeur
                            </label>
                            <Dropdown
                                value={selectedTeacherId}
                                onSelect={(option) => handleChange("teacher", option.label)}
                                options={teacherOptionsData?.data || []}
                                placeholder="Sélectionner un professeur"
                                disabled={!teacherOptionsData?.data}
                                buttonClassName="px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salle
                            </label>
                            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm">
                                {formData.room}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Heure de début"
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleChange("startTime", e.target.value)}
                            />
                            <Input
                                label="Heure de fin"
                                name="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleChange("endTime", e.target.value)}
                            />
                        </div>

                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                        />
                    </div>

                    {hasChanges && (
                        <div className="mt-6 flex justify-end">
                            <Button
                                type="submit"
                                disabled={updateLessonMutation.isPending}
                                label={updateLessonMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                                className="disabled:bg-gray-400 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LessonDetailsModal;