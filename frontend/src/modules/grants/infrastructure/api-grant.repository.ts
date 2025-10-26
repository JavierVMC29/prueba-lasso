import api from "@src/lib/api";

import type { GrantRepository } from "../domain/grant.repository";
import type { CriteriaDto } from "../domain/dtos/criteria.dto";
import type { Grant } from "../domain/entities/grant.entity";
import type { CreateGrantsDto } from "../domain/dtos/create-grants.dto";
import type { ApiResponse, Page } from "@src/interfaces/api-response.interface";

const ENDPOINT = "/grants";

export const ApiGrantRepository: GrantRepository = {
  getGrants: async (dto: CriteriaDto) => {
    const params = new URLSearchParams();

    if (dto.name && dto.name.trim()) {
      params.append("name", dto.name);
    }

    if (dto.tags && dto.tags.length > 0) {
      dto.tags.forEach((tag) => {
        params.append("tag", tag);
      });
    }

    if (dto.page !== undefined) {
      params.append("page", dto.page.toString());
    }
    if (dto.size) {
      params.append("size", dto.size.toString());
    }

    const queryString = params.toString();
    const url = `${ENDPOINT}${queryString ? `?${queryString}` : ""}`;

    const res = await api.get<ApiResponse<Page<Grant>>>(url);

    return res.data;
  },

  getGrantById: async (id: number) => {
    const res = await api.get<ApiResponse<Grant>>(`${ENDPOINT}/${id}`);
    return res.data;
  },

  createGrants: async (dto: CreateGrantsDto) => {
    const res = await api.post<ApiResponse<Grant[]>>(`${ENDPOINT}`, dto);
    return res.data;
  },
};
