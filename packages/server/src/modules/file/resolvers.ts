import file from '.';
import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Query: {
    getEntryFile: async (
      _root,
      { fullPath, path }: HDS.IGetEntryFileOnQueryArguments,
      context
    ) => file.getEntryFilePath({ path, fullPath, context })
  }
};
