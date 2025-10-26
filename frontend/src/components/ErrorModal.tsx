import { CircleAlertIcon, XIcon } from "lucide-react";
import type { FC } from "react";

interface Props {
  data: ErrorModalData;
  onClose: () => void;
}

export interface ErrorModalData {
  title: string;
  message: string;
  link?: string;
}

export const ErrorModal: FC<Props> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`relative flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-lg w-full 
        // --- CAMBIO: Borde a slate-200 ---
        border-slate-200
        ${data.link ? "max-w-5xl" : "max-w-lg"}`}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-700 hover:text-slate-900 cursor-pointer">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <CircleAlertIcon className="w-6 h-6 text-red-500" />
            <h2 className="text-lg leading-6 font-semibold">{data.title}</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{data.message}</p>
            {data.link && (
              <>
                <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all mt-2 inline-block">
                  {data.link}
                </a>
                <iframe src={data.link} title="Vista previa del enlace" className="mt-4 w-full h-[70vh] rounded-lg border border-gray-300" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
