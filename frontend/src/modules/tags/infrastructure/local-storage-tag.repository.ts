// --- LocalStorage Implementation ---

import type { ApiResponse } from "@src/interfaces/api-response.interface";
import type { Tag } from "../domain/entities/tag.entity";
import type { TagRepository } from "../domain/grant.repository";

const MOCK_TAGS: Tag[] = ["agriculture", "education", "STEM", "sustainability", "research", "soil", "water", "rural"];

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
 * Repository Implementation using LocalStorage
 */
export const LocalStorageTagRepository: TagRepository = {
  getTags: async () => {
    await _delay(300); // Simulate network delay
    const response = _buildSuccessResponse(MOCK_TAGS, "Grants retrieved successfully", 200, "/grants");
    return Promise.resolve(response);
  },
};
