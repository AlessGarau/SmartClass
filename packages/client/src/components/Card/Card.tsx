import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    headerAction?: ReactNode;
    size?: "sm" | "md" | "lg";
}

const Card = ({ children, className, title, headerAction }: CardProps) => {
    return (
        <div
            className={cn(
                "rounded-lg border shadow-sm bg-white border-grayBorder p-8",
                className
            )}
        >
            {(title || headerAction) && (
                <div className="flex items-start justify-between mb-4 ">
                    <div className="flex items-center gap-3">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-text">
                                    {title}
                                </h3>
                            )}
                        </div>
                    </div>
                    {headerAction && (
                        <div className="flex-shrink-0">{headerAction}</div>
                    )}
                </div>
            )}
            <div>{children}</div>
        </div>
    );
};

export default Card;
