import { ResolverMap } from '../../typings/globals';
import project from '.';
import folder from '../folder';
import redis from '../../redis';

export const resolver: ResolverMap = {
  Mutation: {
    createProject: async (_, input: HDS.ICreateProjectOnMutationArguments) =>
      await project.create(input)
  },
  Query: {
    isHardocsProject: async (
      _root,
      { path }: HDS.IIsHardocsProjectOnQueryArguments
    ) => folder.isHardocsProject(path, redis)
  }
};
