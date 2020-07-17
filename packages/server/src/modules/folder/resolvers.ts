import folders from './folders';
import { ResolverMap } from '../../typings/globals';
import cwd from '../cwd/cwd';

export const resolver: ResolverMap = {
  Query: {
    folderExists: (
      _root,
      { file }: HDS.IFolderExistsOnQueryArguments
    ): boolean => folders.isDirectory(file),
    folderCurrent: (_root, args) => folders.getCurrent(args)
  },

  Mutation: {
    folderOpen: (_root, { path }: HDS.IFolderOpenOnMutationArguments) =>
      folders.open(path),
    folderOpenParent: () => folders.openParent(cwd.get())
  }
};

// export default resolver;
