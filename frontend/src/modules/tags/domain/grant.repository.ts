import type { ApiResponse } from "@src/interfaces/api-response.interface";
import type { Tag } from "./entities/tag.entity";

export interface TagRepository {
  getTags: () => Promise<ApiResponse<Tag[]>>;
}
