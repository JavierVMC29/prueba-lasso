import type { TextareaHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

// Props para el nuevo componente TextArea, extendiendo los atributos nativos de HTML
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  label?: string; // Label opcional para una mejor accesibilidad
}

export const TextArea = ({ id, register, error, label, ...textAreaProps }: TextAreaProps) => {
  return (
    <div className="w-full">
      {/* Si se proporciona un label, lo renderizamos */}
      {label && (
        // --- CAMBIO: Color de texto a slate-700 ---
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          id={id}
          {...register}
          {...textAreaProps}
          className={`
            w-full px-4 py-2 border rounded-lg shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2
            min-h-[100px] resize-y
            
            ${textAreaProps.disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-200" : `bg-slate-100 focus:ring-green-500 ${error ? "border-red-500" : "border-slate-300"}`}
            
            ${textAreaProps.className || ""}
          `}
        />
      </div>
      {/* Muestra el mensaje de error de validación si existe */}
      {error && (
        <p data-testid={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};
