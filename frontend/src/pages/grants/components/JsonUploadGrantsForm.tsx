import React, { useState } from "react";
import { AlertTriangle, Download, UploadCloud, FileCheck2, X } from "lucide-react";
import { z } from "zod";

import type { CreateGrantsDto } from "@src/modules/grants/domain/dtos/create-grants.dto";

import { Button } from "@src/components/Button";

// Zod schema for a single grant
const singleGrantSchema = z.object({
  name: z.string().min(1, "Grant name is required"),
  description: z.string().min(1, "Description is required"),
});

// Zod schema for the JSON upload (array of grants)
const jsonUploadSchema = z.array(singleGrantSchema).min(1, "File must contain at least one grant.");

interface Props {
  isLoading: boolean;
  onSubmit: (data: CreateGrantsDto) => Promise<boolean>; // Returns promise for reset
}

export const JsonUploadGrantsForm: React.FC<Props> = ({ isLoading, onSubmit }) => {
  const [fileError, setFileError] = useState<string | null>(null);
  // --- NEW: State to hold parsed grants for confirmation ---
  const [parsedGrants, setParsedGrants] = useState<CreateGrantsDto | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Handler for file input change (Upload + Validate)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setParsedGrants(null);
    setFileName("");

    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (!text) throw new Error("File is empty.");

        const jsonData = JSON.parse(text as string);

        // --- VALIDATE JSON ---
        const validation = jsonUploadSchema.safeParse(jsonData);
        if (!validation.success) {
          // Log developer-friendly error
          console.error(validation.error);
          // Show user-friendly error
          throw new Error("Invalid JSON structure. Must be an array of {name, description}.");
        }

        // --- Validation passed, set data for confirmation ---
        setParsedGrants(validation.data);
      } catch (err: any) {
        setFileError(err.message || "Failed to read or parse file.");
      }
    };
    reader.readAsText(file);

    // Reset file input value so onChange fires again for the same file
    e.target.value = "";
  };

  // --- NEW: Handler for the "Confirm" button ---
  const handleConfirmSubmit = async () => {
    if (!parsedGrants) return;

    const success = await onSubmit(parsedGrants);
    if (success) {
      // Clear the confirmation view on success
      setParsedGrants(null);
      setFileName("");
    }
  };

  // --- NEW: Handler to cancel the confirmation ---
  const handleCancel = () => {
    setParsedGrants(null);
    setFileName("");
    setFileError(null);
  };

  // --- View 1: Upload Prompt ---
  if (!parsedGrants) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
          <p className="text-sm text-slate-600">
            Upload a file with an array of grants.
            <br />
            <strong>Format:</strong> <code className="bg-slate-200 text-xs p-1 rounded">{"[{...}, {...}]"}</code>
          </p>
          <a href="/grants_template.json" download="grants_template.json" className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Download Template
          </a>
        </div>

        <label
          data-testid="file-upload-zone"
          htmlFor="json-upload"
          className={`flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-white border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <UploadCloud className="w-8 h-8 text-slate-500" />
          <span className="mt-2 text-sm font-medium text-slate-600">{isLoading ? "Processing..." : "Click to select JSON file"}</span>
        </label>
        <input data-testid="file-input" id="json-upload" type="file" accept=".json" className="hidden" onChange={handleFileChange} disabled={isLoading} />
        {fileError && (
          <p data-testid="file-error-message" className="text-sm text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {fileError}
          </p>
        )}
      </div>
    );
  }

  // --- View 2: Confirmation Step ---
  return (
    <div data-testid="confirmation-view" className="space-y-4">
      <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileCheck2 className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">File Ready for Submission</h3>
              <p className="text-sm text-green-700">
                Found <strong>{parsedGrants.length} grants</strong> in <span className="font-medium">{fileName}</span>.
              </p>
            </div>
          </div>
          <Button data-testid="cancel-upload-button" type="button" variant="light" onClick={handleCancel} disabled={isLoading} className="!w-auto !p-2" aria-label="Cancel upload">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* List of parsed grants (optional but good for UX) */}
      <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="text-sm font-medium text-slate-600">Grants to be uploaded:</h4>
        <ul className="list-disc list-inside text-sm text-slate-500">
          {parsedGrants.map((grant, index) => (
            <li key={index} className="truncate">
              {grant.name}
            </li>
          ))}
        </ul>
      </div>

      <Button data-testid="confirm-upload-button" type="button" variant="primary" onClick={handleConfirmSubmit} disabled={isLoading} className="w-full">
        {isLoading ? "Submitting..." : `Confirm and Submit ${parsedGrants.length} Grant(s)`}
      </Button>
    </div>
  );
};
