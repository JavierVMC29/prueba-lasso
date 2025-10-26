import React, { type ReactNode } from "react";
import { clsx } from "@src/utils/clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "light" | "kushki" | "placetopay" | "default";
  icon?: ReactNode; // nuevo prop para el icono
};

export const Button: React.FC<ButtonProps> = ({ children, variant = "default", className, icon, ...props }) => {
  const baseStyles = "rounded-lg font-semibold cursor-pointer py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";

  const variantStyles: Record<string, string> = {
    default: "bg-transparent text-slate-900 hover:bg-slate-100",
    primary: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow",
    danger: "bg-gradient-to-b from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow",
    light: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm",
  };

  return (
    <button className={clsx(baseStyles, variantStyles[variant], className)} {...props}>
      {icon ? (
        <div className="flex items-center justify-center space-x-2">
          {icon}
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
