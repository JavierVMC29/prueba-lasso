import type { InputHTMLAttributes, ReactNode } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { Input } from "./Input";
import { Label } from "./Label";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  icon?: ReactNode;
  hint?: string;
}

export const TextInput = ({ id, label, register, error, icon, hint, ...inputProps }: TextInputProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} register={register} error={error} icon={icon} className="mt-1" {...inputProps} />
      {hint && <span className="text-sm text-slate-500">{hint}</span>}
    </div>
  );
};
