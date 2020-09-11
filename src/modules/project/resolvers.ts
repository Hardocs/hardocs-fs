import { ResolverMap } from '../../typings/globals';
import project from '.';
import folder from '../folder';

export const resolver: ResolverMap = {
  Mutation: {
    createProject: async (
      _,
      { input }: HDS.ICreateProjectOnMutationArguments,
      context
    ) => await project.create({ context, input }),
    createProjectFromExisting: async (
      _,
      { input }: HDS.ICreateProjectOnMutationArguments,
      context
    ) => await project.createFromExisting({ context, input }),
    openProject: (
      _root,
      { path }: HDS.IOpenProjectOnMutationArguments,
      context
    ) => {
      if (!path) {
        throw new Error('Path must not be empty');
      }
      return project.open({ path, context });
    }
  },
  Query: {
    isHardocsProject: async (
      _root,
      { path }: HDS.IIsHardocsProjectOnQueryArguments,
      context
    ) => folder.isHardocsProject({ path, context })
  }
};
