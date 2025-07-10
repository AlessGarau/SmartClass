import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ label, ...rest }, ref) => {
    return <button ref={ref} {...rest} className="bg-primary text-white px-4 py-2 rounded-md">{label}</button>;
}
);

Button.displayName = "Button";

export default Button;