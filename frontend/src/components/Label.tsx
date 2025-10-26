import type { LabelHTMLAttributes } from "react";

// Props para el nuevo componente Label
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

export const Label = ({ htmlFor, children, ...props }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} {...props} className={`block text-sm font-medium text-slate-700 ${props.className || ""}`}>
      {children}
    </label>
  );
};
