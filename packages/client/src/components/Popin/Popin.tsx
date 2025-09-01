import React from "react";

interface PopinProps {
    open: boolean;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
    actions?: React.ReactNode;
    className?: string;
}

const Popin = ({ open, title, icon, children, onClose, actions, className }: PopinProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
            <div className={`bg-gray-50 rounded-xl border border-gray-200 p-6 w-full max-w-2xl shadow-lg flex flex-col gap-6 "${className || ''}"`}>
                <div className="flex items-center gap-2 mb-2">
                    {icon && <span className="bg-green-100 rounded-full p-2 flex items-center justify-center">{icon}</span>}
                    <span className="font-bold text-lg text-gray-800">{title}</span>
                </div>
                {children}
                {actions && <div className="flex justify-end mt-4">{actions}</div>}
                <button type="button" aria-label="Fermer" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
        </div>
    );
};

export default Popin;
