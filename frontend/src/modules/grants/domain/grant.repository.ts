import type { ApiResponse, Page } from "@src/interfaces/api-response.interface";
import type { CreateGrantsDto } from "./dtos/create-grants.dto";
import type { CriteriaDto } from "./dtos/criteria.dto";
import type { Grant } from "./entities/grant.entity";

export interface GrantRepository {
  getGrants: (dto: CriteriaDto) => Promise<ApiResponse<Page<Grant>>>;
  getGrantById: (id: number) => Promise<ApiResponse<Grant | null>>;
  createGrants: (dto: CreateGrantsDto) => Promise<ApiResponse<Grant[]>>;
}
