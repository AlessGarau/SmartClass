import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "time" | "date";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, type = "text", placeholder, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
