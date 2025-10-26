import type { FC } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  id: string;
  label: string;
  options: { value: string | number; label: string }[];
  error?: FieldError;
  loading?: boolean;
  disabled?: boolean;

  // --- Opcional para uso como componente controlado manualmente ---
  onChange?: (value: string) => void;
  value?: string;

  // --- Opcional para uso con React Hook Form ---
  register?: UseFormRegisterReturn;
}

export const SelectInput: FC<Props> = ({ id, label, options, error, onChange, value, register, loading, disabled }) => {
  // Determinar los props para el <select> basado en si se usa `register` o `value`/`onChange`
  const selectProps = register ? { ...register } : { value: value || "", onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        {...selectProps}
        disabled={loading || disabled}
        className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2
          
          disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200
          bg-slate-100 focus:ring-green-500
          ${error ? "border-red-500" : "border-slate-300"}
        `}
      >
        <option value="">{loading ? "Cargando..." : "Seleccione una opción"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
};
