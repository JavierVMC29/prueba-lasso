// --- LocalStorage Implementation ---

import type { ApiResponse, Page } from "@src/interfaces/api-response.interface";
import type { Grant } from "../domain/entities/grant.entity";
import type { GrantRepository } from "../domain/grant.repository";
import type { CriteriaDto } from "../domain/dtos/criteria.dto";
import type { CreateGrantsDto } from "../domain/dtos/create-grants.dto";

const LOCAL_STORAGE_KEY = "grants_db";
const MOCK_TAGS = ["agriculture", "education", "STEM", "sustainability", "research", "soil", "water", "rural"];

// --- NEW: Helper functions to build standardized ApiResponse ---

const _delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a standardized success response.
 */
const _buildSuccessResponse = <T>(data: T, message: string, statusCode: number = 200, path: string = "/localstorage"): ApiResponse<T> => {
  return {
    status: "SUCCESS",
    statusCode: statusCode,
    message: message,
    timestamp: new Date().toISOString(),
    path: path,
    data: data,
    errorCode: null,
  };
};

/**
 * Creates a standardized error response.
 */
const _buildErrorResponse = (statusCode: number, errorCode: string, message: string, path: string = "/localstorage"): ApiResponse<null> => {
  return {
    status: "ERROR",
    statusCode: statusCode,
    message: message,
    timestamp: new Date().toISOString(),
    path: path,
    data: null,
    errorCode: errorCode,
  };
};

/**
 * Helper to read all grants from localStorage
 */
const _getAllGrantsFromStorage = (): Grant[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? (JSON.parse(data) as Grant[]) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

/**
 * Helper to save all grants to localStorage
 */
const _saveAllGrantsToStorage = (grants: Grant[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(grants));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

/**
 * Simulates the backend tagging process
 */
const _simulateTagging = (description: string, name: string): string[] => {
  const foundTags = new Set<string>();
  const text = (description + " " + name).toLowerCase();
  MOCK_TAGS.forEach((tag) => {
    if (text.includes(tag.toLowerCase())) {
      foundTags.add(tag);
    }
  });
  return Array.from(foundTags);
};

/**
 * Repository Implementation using LocalStorage
 */
export const LocalStorageGrantRepository: GrantRepository = {
  getGrants: async (dto: CriteriaDto) => {
    await _delay(300); // Simulate network delay
    const allGrants = _getAllGrantsFromStorage();

    // 1. Apply filters
    let filteredGrants = allGrants
      .filter((grant) => {
        // Name filter (partial, case-insensitive)
        if (dto.name && dto.name.trim()) {
          return grant.name.toLowerCase().includes(dto.name.toLowerCase());
        }
        return true;
      })
      .filter((grant) => {
        // Tag filter (must have ALL tags)
        if (dto.tags && dto.tags.length > 0) {
          return dto.tags.every((tag) => grant.tags.includes(tag));
        }
        return true;
      })
      // Simulate DB ordering
      .sort((a, b) => a.name.localeCompare(b.name));

    // 2. Apply pagination
    const page = dto.page ?? 0;
    const size = dto.size ?? 10;
    const totalElements = filteredGrants.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;

    const content = filteredGrants.slice(start, end);
    const last = page + 1 >= totalPages;

    // 3. Format as a Page<T> object
    const pageResult: Page<Grant> = {
      content,
      pageNo: page,
      pageSize: size,
      totalElements,
      totalPages,
      last,
    };

    // 4. --- NEW: Wrap in ApiResponse ---
    const response = _buildSuccessResponse(pageResult, "Grants retrieved successfully", 200, "/grants");
    return Promise.resolve(response);
  },

  getGrantById: async (id: number) => {
    await _delay(300); // Simulate network delay
    const allGrants = _getAllGrantsFromStorage();
    const foundGrant = allGrants.find((grant) => grant.id === id);

    // --- NEW: Return ApiResponse (success or error) ---
    if (foundGrant) {
      const response = _buildSuccessResponse(foundGrant, "Grant retrieved successfully", 200, `/grants/${id}`);
      return response;
    } else {
      const errorResponse = _buildErrorResponse(404, "NOT_FOUND", "Grant not found", `/grants/${id}`);
      return errorResponse;
    }
  },

  createGrants: async (dto: CreateGrantsDto) => {
    const existingGrants = _getAllGrantsFromStorage();

    // Find the highest ID to simulate auto-increment
    const maxId = existingGrants.reduce((max, g) => (g.id > max ? g.id : max), 0);

    const newlyCreatedGrants: Grant[] = [];

    dto.forEach((newGrantData, index) => {
      // Simulate backend grant creation
      const newGrant: Grant = {
        id: maxId + 1 + index,
        name: newGrantData.name,
        description: newGrantData.description,
        // Simulate backend tagging
        tags: _simulateTagging(newGrantData.description, newGrantData.name),
      };
      newlyCreatedGrants.push(newGrant);
    });

    // Save the combined list
    _saveAllGrantsToStorage([...existingGrants, ...newlyCreatedGrants]);

    // --- NEW: Wrap in ApiResponse (201 Created) ---
    const response = _buildSuccessResponse(newlyCreatedGrants, `${newlyCreatedGrants.length} grants added successfully`, 201, "/grants");
    return Promise.resolve(response);
  },
};
