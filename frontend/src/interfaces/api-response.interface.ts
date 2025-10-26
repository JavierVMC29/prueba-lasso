// For paginated responses
export interface Page<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Base interface for all API responses
export interface ApiResponse<T> {
  status: ApiResponseStatus;
  statusCode: number;
  message: string;
  timestamp: string; // ISO 8601 date string
  path: string;
  // If status is 'SUCCESS', data will not be null
  // If status is 'ERROR', data will be null and errorCode will have a value
  data: T | null;
  errorCode: string | null;
}

export type ApiResponseStatus = "SUCCESS" | "ERROR";

// Example usage for a Company
// type Company = { id: number; name: string; createdAt: string; };
// const response: ApiResponse<Company> = await fetch(...);

// Example usage for a paginated list of Companies
// const response: ApiResponse<Page<Company>> = await fetch(...);
