import folders from '.';
import { ResolverMap } from '../../typings/globals';
import cwd from '../cwd';

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
    folderCreate: (
      _root,
      { name: path }: HDS.IFolderCreateOnMutationArguments
    ) => folders.createFolder({ path })
  },

  Folder: {
    children: (folder) => folders.list({ path: folder.path })
  }
};

// export default resolver;
