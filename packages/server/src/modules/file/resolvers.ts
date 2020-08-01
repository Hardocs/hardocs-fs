import file from '.';
import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Query: {
    getEntryFile: async (
      _root,
      { force, path }: HDS.IGetEntryFileOnQueryArguments,
      context
    ) => file.getEntryFilePath({ path, force, context })
  }
};
