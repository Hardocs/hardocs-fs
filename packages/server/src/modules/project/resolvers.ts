import { ResolverMap } from '../../typings/globals';
import project from '.';

export const resolver: ResolverMap = {
  Mutation: {
    createProject: async (_, input: HDS.ICreateProjectOnMutationArguments) =>
      await project.create(input)
  }
};
