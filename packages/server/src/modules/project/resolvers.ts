import { ResolverMap } from '../../typings/globals';
import project from '.';
import folder from '../folder';

export const resolver: ResolverMap = {
  Mutation: {
    createProject: async (
      _,
      { input }: HDS.ICreateProjectOnMutationArguments,
      context
    ) => await project.create({ context, input })
  },
  Query: {
    isHardocsProject: async (
      _root,
      { path }: HDS.IIsHardocsProjectOnQueryArguments,
      context
    ) => folder.isHardocsProject({ path, context })
  }
};
