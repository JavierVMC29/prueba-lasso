import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Select, { type StylesConfig } from "react-select";

import type { Grant } from "@src/modules/grants/domain/entities/grant.entity";
import type { Page } from "@src/interfaces/api-response.interface";

import { useDebounce } from "@src/hooks/useDebounce";
import { TextInput } from "@src/components/TextInput";
import { Button } from "@src/components/Button";

import { grantService } from "./services/grant.service";
import { tagService } from "./services/tag.service";
import { ErrorModal, type ErrorModalData } from "@src/components/ErrorModal";

// --- 3. Define the option type for React Select ---
interface SelectOption {
  value: string;
  label: string;
}

// --- 4. Define styles for React Select to match Lasso theme ---
const lassoSelectStyles: StylesConfig<SelectOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f1f5f9", // slate-100
    borderColor: state.isFocused ? "#22c55e" : "#cbd5e1", // green-500 : slate-300
    boxShadow: state.isFocused ? "0 0 0 1px #22c55e" : "none",
    "&:hover": {
      borderColor: "#22c55e", // green-500
    },
    minHeight: "42px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#dcfce7", // green-100
    color: "#15803d", // green-700
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#15803d", // green-700
    fontWeight: 500,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#16a34a", // green-600
    "&:hover": {
      backgroundColor: "#bbf7d0", // green-200
      color: "#15803d", // green-700
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#dcfce7" // green-100
      : state.isFocused
      ? "#f1f5f9" // slate-100
      : "white",
    color: "#1e293b", // slate-800
    "&:active": {
      backgroundColor: "#dcfce7", // green-100
    },
  }),
};

const PAGE_SIZE = 10;

const ViewGrantsPage: React.FC = () => {
  // --- State for Filters ---
  const [nameFilter, setNameFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // This now holds the array of tag strings

  // --- State for Tags Dropdown ---
  const [availableTags, setAvailableTags] = useState<SelectOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // --- State for Data and Pagination ---
  const [grants, setGrants] = useState<Grant[]>([]);
  const [pageData, setPageData] = useState<Page<Grant> | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed

  // --- State for UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorModalData | null>(null);

  // --- Debounce Filter Inputs ---
  const debouncedName = useDebounce(nameFilter, 500);

  // --- 5. Fetch available tags on component mount ---
  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoadingTags(true);
        const response = await tagService.getTags();
        if (response.status === "SUCCESS" && response.data) {
          // Convert string[] to { value: string, label: string }[]
          const tagOptions = response.data.map((tag) => ({ value: tag, label: tag }));
          setAvailableTags(tagOptions);
        }
      } catch (err) {
        console.error("Failed to load tags", err);
      } finally {
        setIsLoadingTags(false);
      }
    };
    loadTags();
  }, []);

  /**
   * Fetches grants from the service based on current filters and page.
   */
  const fetchGrants = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // No need to process tags string, we already have an array
    try {
      const response = await grantService.getGrants({
        name: debouncedName,
        tags: selectedTags, // Use the string array directly
        page: currentPage,
        size: PAGE_SIZE,
      });

      if (response.status === "SUCCESS" && response.data) {
        setGrants(response.data.content);
        setPageData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch grants.");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setGrants([]);
      setPageData(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedName, selectedTags]); // Updated dependency

  // --- Effect to re-fetch when filters or page change ---
  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  // --- Effect to reset to page 0 when filters change ---
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedName, selectedTags]); // Updated dependency

  // --- Pagination Handlers ---
  const handleNextPage = () => {
    if (pageData && !pageData.last) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // --- 6. Handler for React Select change ---
  const handleTagsChange = (selectedOptions: readonly SelectOption[]) => {
    // Convert back from SelectOption[] to string[]
    const tagValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setSelectedTags(tagValues);
  };

  // --- 7. Helper to map string[] back to SelectOption[] for the value prop ---
  const getSelectedTagOptions = () => {
    return availableTags.filter((option) => selectedTags.includes(option.value));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Explore Grants</h1>

      {/* --- Filter Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg shadow-lg border border-slate-200">
        <TextInput id="name-filter" label="Filter by Name" placeholder="e.g., Sustainable Agriculture..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} icon={<Search className="w-4 h-4 text-slate-400" />} />

        {/* --- 8. Replaced TextInput with React Select --- */}
        <div>
          <label htmlFor="tags-filter" className="block text-sm font-medium text-slate-700 mb-1">
            Filter by Tags
          </label>
          <Select
            id="tags-filter"
            isMulti
            options={availableTags}
            value={getSelectedTagOptions()} // Controlled component value
            isLoading={isLoadingTags}
            onChange={handleTagsChange}
            placeholder="Select or type tags..."
            closeMenuOnSelect={false}
            styles={lassoSelectStyles}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* --- Results Section (no change) --- */}
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <span className="ml-3 text-slate-600">Loading grants...</span>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && <ErrorModal data={error} onClose={() => setError(null)} />}

        {/* Empty State */}
        {!isLoading && !error && grants.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow border border-slate-200">
            <h3 className="text-lg font-medium text-slate-700">No Grants Found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
          </div>
        )}

        {/* Grant List */}
        {!isLoading && !error && grants.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {grants.map((grant) => (
              <div key={grant.id} className="p-5 bg-white rounded-lg shadow border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">{grant.name}</h2>
                <p className="text-sm text-slate-600 mt-2">{grant.description}</p>
                {grant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {grant.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- Pagination Controls (no change) --- */}
        {pageData && pageData.totalElements > 0 && (
          <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-lg shadow border border-slate-200">
            <span className="text-sm text-slate-600">
              Page <strong>{currentPage + 1}</strong> of <strong>{pageData.totalPages}</strong>
              <span className="hidden sm:inline"> ({pageData.totalElements} results)</span>
            </span>
            <div className="flex gap-2">
              <Button variant="light" onClick={handlePrevPage} disabled={currentPage === 0 || isLoading} icon={<ChevronLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <Button variant="light" onClick={handleNextPage} disabled={pageData.last || isLoading} icon={<ChevronRight className="w-4 h-4" />} className="flex-row-reverse">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGrantsPage;
