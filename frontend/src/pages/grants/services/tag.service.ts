import { getTags } from "@src/modules/tags/application/getTags";

import { createTagRepository } from "@src/modules/tags/infrastructure/grant-repository.factory";

const repositoryPromise = createTagRepository();

export const tagService = {
  getTags: async () => {
    const repository = await repositoryPromise;
    return await getTags(repository);
  },
};
