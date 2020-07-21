import folders from '.';
import { ResolverMap } from '../../typings/globals';
import cwd from '../cwd/cwd';

export const resolver: ResolverMap = {
  Query: {
    folderExists: (
      _root,
      { path }: HDS.IFolderExistsOnQueryArguments
    ): boolean => folders.isDirectory({ path }),
    folderCurrent: () => folders.getCurrent()
  },

  Mutation: {
    folderOpen: (_root, { path }: HDS.IFolderOpenOnMutationArguments) =>
      folders.open({ path }),
    folderOpenParent: () => folders.openParent({ path: cwd.get() }),
    folderCreate: (_root, { name }: HDS.IFolderCreateOnMutationArguments) =>
      folders.createFolder({ name })
  },

  Folder: {
    children: (folder) => folders.list(folder.path)
  }
};

// export default resolver;
