import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

// Props para el nuevo componente Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  icon?: React.ReactNode;
}

export const Input = ({ id, register, error, icon, ...inputProps }: InputProps) => {
  return (
    <>
      <div className="relative w-full flex items-center">
        <input
          id={id}
          {...register}
          {...inputProps}
          className={`
            w-full px-4 py-2 border rounded-lg shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2
            
            ${inputProps.disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-200" : `bg-slate-100 focus:ring-green-500 ${error ? "border-red-500" : "border-slate-300"}`}
            ${icon ? "pr-10" : ""}
            ${inputProps.className || ""}
          `}
        />
        {icon && <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">{icon}</div>}
      </div>
      {error && (
        <p data-testid={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error.message}
        </p>
      )}
    </>
  );
};
