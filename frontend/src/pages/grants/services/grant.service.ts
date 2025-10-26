import type { CreateGrantsDto } from "@src/modules/grants/domain/dtos/create-grants.dto";
import type { CriteriaDto } from "@src/modules/grants/domain/dtos/criteria.dto";

import { getGrants } from "@src/modules/grants/application/getGrants";
import { getGrantById } from "@src/modules/grants/application/getGrantById";
import { createGrants } from "@src/modules/grants/application/createGrants";

import { createGrantRepository } from "@src/modules/grants/infrastructure/grant-repository.factory";

const repositoryPromise = createGrantRepository();

export const grantService = {
  getGrants: async (dto: CriteriaDto) => {
    const repository = await repositoryPromise;
    return await getGrants(repository, dto);
  },

  getGrantById: async (id: number) => {
    const repository = await repositoryPromise;
    return await getGrantById(repository, id);
  },

  createGrant: async (dto: CreateGrantsDto) => {
    const repository = await repositoryPromise;
    return await createGrants(repository, dto);
  },
};
