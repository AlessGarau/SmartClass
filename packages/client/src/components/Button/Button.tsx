import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ label, className, icon, ...rest }, ref) => {
    return <button ref={ref} {...rest} className={cn("bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-primary/80", className)}>
        {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
        {label}
    </button>;
}
);

Button.displayName = "Button";

export default Button;