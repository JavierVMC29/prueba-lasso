import type { CriteriaDto } from "../domain/dtos/criteria.dto";
import type { GrantRepository } from "../domain/grant.repository";

export const getGrants = async (repository: GrantRepository, dto: CriteriaDto) => {
  return await repository.getGrants(dto);
};
