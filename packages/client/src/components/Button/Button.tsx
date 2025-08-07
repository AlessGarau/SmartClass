import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: string;
    tooltip?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ label = "", className, icon, tooltip, ...rest }, ref) => {
    return (
        <button
            ref={ref}
            {...rest}
            className={cn(
                "bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-primary/80 relative group",
                className
            )}
            title={tooltip}
        >
            {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
            {label}
            {tooltip && !label && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {tooltip}
                </span>
            )}
        </button>
    );
});

Button.displayName = "Button";

export default Button;