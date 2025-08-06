import React from "react";
import { calculateDuration } from "../../../utils/planning";
import { cn } from "../../../utils/cn";
import type { PlannedClass } from "../../../types/Planning";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planningQueryOptions } from "../../../api/queryOptions";
import toast from "react-hot-toast";

interface PlannedClassSlotProps {
    plannedClass?: PlannedClass;
    isEmpty?: boolean;
    startTime?: string;
    endTime?: string;
}

const BASE_SLOT_CLASSES = "flex flex-col items-center justify-center p-2 border-2 rounded-md mx-2";

const PlannedClassSlot: React.FC<PlannedClassSlotProps> = ({ plannedClass, isEmpty = false, startTime, endTime }) => {
    const queryClient = useQueryClient();
    const duration = (startTime && endTime) ? calculateDuration(startTime, endTime) :
        (plannedClass ? calculateDuration(plannedClass.startTime, plannedClass.endTime) : 60);

    const flexGrowValue = duration;

    const deleteLessonMutation = useMutation({
        ...planningQueryOptions.deleteLesson(),
        onSuccess: () => {
            toast.success('Cours supprimé avec succès');
            queryClient.invalidateQueries({ queryKey: ['planning'] });
        },
        onError: (error) => {
            console.error('Error deleting lesson:', error);
            toast.error('Erreur lors de la suppression du cours');
        }
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (plannedClass?.id && confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            deleteLessonMutation.mutate(plannedClass.id);
        }
    };

    if (isEmpty || !plannedClass) {
        return (
            <div
                className={cn(BASE_SLOT_CLASSES, "bg-lightGreen border-greenBorder")}
                style={{ flexGrow: flexGrowValue }}
            >
                <span className="text-sm font-semibold text-greenText">Disponible</span>
                {startTime && endTime && (
                    <span className="text-xs text-greenText">{startTime} - {endTime}</span>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(BASE_SLOT_CLASSES, "bg-slotFilled/10 border-slotFilled/26 relative group")}
            style={{ flexGrow: flexGrowValue }}
        >
            <button
                onClick={handleDelete}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-slotFilled text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs font-bold"
                disabled={deleteLessonMutation.isPending}
                aria-label="Supprimer le cours"
            >
                X
            </button>
            <div className="font-semibold text-sm text-slotFilled">{plannedClass.subject}</div>
            <div className="text-xs text-slotFilled">{plannedClass.teacher}</div>
            <div className="text-xs text-slotFilled">
                {plannedClass.startTime} - {plannedClass.endTime}
            </div>
        </div>
    );
};

export default PlannedClassSlot;