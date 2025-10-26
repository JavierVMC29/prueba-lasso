import type { TagRepository } from "../domain/grant.repository";

export const getTags = async (repository: TagRepository) => {
  return await repository.getTags();
};
