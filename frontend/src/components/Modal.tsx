import { clsx } from "@src/utils/clsx";
import type { FC, ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex p-2 md:p-5 items-center justify-center bg-black/50 bg-opacity-50 overflow-y-auto">
      <div className={clsx("bg-white rounded-xl shadow-lg w-full max-w-3xl relative flex flex-col max-h-[90vh]", className)}>
        {/* Close button */}
        {onClose && (
          <button onClick={onClose} className="absolute cursor-pointer top-3 right-3 text-slate-600 hover:text-slate-900 z-10">
            ✕
          </button>
        )}

        <div className="p-2 md:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
