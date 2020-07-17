import folders from './folders';
import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Query: {
    folderExists: (
      _root,
      { file }: HDS.IFolderExistsOnQueryArguments
    ): boolean => folders.isDirectory(file),
    folderCurrent: (_root, args, context) => folders.getCurrent(args, context),
    folderOpen: (
      _root,
      { path }: HDS.IFolderOpenOnMutationArguments
    ): boolean => folders.isDirectory(path)
  }
};

// export default resolver;
