import api from "@src/lib/api";

import type { ApiResponse } from "@src/interfaces/api-response.interface";

import type { TagRepository } from "../domain/grant.repository";
import type { Tag } from "../domain/entities/tag.entity";

const ENDPOINT = "/tags";

export const ApiTagRepository: TagRepository = {
  getTags: async () => {
    const url = `${ENDPOINT}`;
    const res = await api.get<ApiResponse<Tag[]>>(url);
    return res.data;
  },
};
