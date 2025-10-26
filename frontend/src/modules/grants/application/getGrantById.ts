import type { GrantRepository } from "../domain/grant.repository";

export const getGrantById = async (repository: GrantRepository, id: number) => {
  return await repository.getGrantById(id);
};
