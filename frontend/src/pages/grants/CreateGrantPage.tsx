import React, { useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

import type { CreateGrantsDto } from "@src/modules/grants/domain/dtos/create-grants.dto";

import { grantService } from "./services/grant.service";
import { ManualGrantsForm } from "./components/ManualGrantsForm";
import { JsonUploadGrantsForm } from "./components/JsonUploadGrantsForm";

type EntryMode = "manual" | "json";

const CreateGrantPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [entryMode, setEntryMode] = useState<EntryMode>("manual");

  const handleCreateGrants = async (grantDto: CreateGrantsDto) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await grantService.createGrant(grantDto);

      if (response.status === "SUCCESS" && response.data) {
        const count = response.data.length;
        setSuccess(`${count} grant(s) added successfully!`);
        setCount(count);
        return true; // Return success
      } else {
        throw new Error(response.message || "Failed to submit grants.");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      return false; // Return failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-0 p-8 bg-white rounded-lg shadow-xl border border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Add New Grants</h2>

      {/* --- Tab Switcher --- */}
      <div className="flex border-b border-slate-200 mb-6">
        <button data-testid="tab-manual" onClick={() => setEntryMode("manual")} className={`py-2 px-4 text-sm font-medium ${entryMode === "manual" ? "border-b-2 border-green-500 text-green-600" : "text-slate-500 hover:text-slate-700"}`}>
          Manual Entry
        </button>
        <button data-testid="tab-json" onClick={() => setEntryMode("json")} className={`py-2 px-4 text-sm font-medium ${entryMode === "json" ? "border-b-2 border-green-500 text-green-600" : "text-slate-500 hover:text-slate-700"}`}>
          Upload JSON
        </button>
      </div>

      {/* --- Conditional Content --- */}
      <div className="mt-6">
        {entryMode === "manual" && <ManualGrantsForm isLoading={isLoading} onSubmit={handleCreateGrants} />}

        {entryMode === "json" && <JsonUploadGrantsForm isLoading={isLoading} onSubmit={handleCreateGrants} />}
      </div>

      {/* --- Global Feedback Area --- */}
      <div data-testid="feedback-area" className="text-center pt-4 mt-6 border-t border-slate-200">
        {isLoading && <p className="text-sm text-slate-500">Processing request...</p>}
        {error && (
          <p data-testid="error-message" className="text-sm text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}
        {success && (
          <div className="space-y-2">
            {/* Wrapper div for spacing */}
            <p data-testid="success-message" className="text-sm text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </p>
            {count > 0 && (
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Tags are being generated in the background and may take a few moments to appear.
              </p>
            )}
            <Link to="/grants/view" className="text-sm text-green-600 hover:text-green-700 underline flex items-center justify-center gap-1">
              Go to View Grants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGrantPage;
