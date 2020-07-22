import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Mutation: {
    createProject: async (
      _,
      { input }: HDS.ICreateProjectOnMutationArguments
    ) => {}
  }
};
