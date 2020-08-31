import file from '.';
import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Query: {
    getEntryFile: async (
      _root,
      { force, path }: HDS.IGetEntryFileOnQueryArguments,
      context
    ) => file.getEntryFilePath({ path, force, context })
  },
  Mutation: {
    openFile: (_root, { filePath }: HDS.IOpenFileOnMutationArguments) =>
      file.openFile({ filePath, isFull: true }),
    writeToFile: (_root, { input }: HDS.IWriteToFileOnMutationArguments) =>
      file.writeToFile(input),
    deleteFile: (_root, { filePath }: HDS.IDeleteFileOnMutationArguments) =>
      file.delete({ filePath })
  }
};
