import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ label, className, ...rest }, ref) => {
    return <button ref={ref} {...rest} className={cn("bg-primary text-white px-4 py-2 rounded-md", className)}>{label}</button>;
}
);

Button.displayName = "Button";

export default Button;