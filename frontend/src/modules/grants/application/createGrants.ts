import type { CreateGrantsDto } from "../domain/dtos/create-grants.dto";
import type { GrantRepository } from "../domain/grant.repository";

export const createGrants = async (repository: GrantRepository, dto: CreateGrantsDto) => {
  return await repository.createGrants(dto);
};
