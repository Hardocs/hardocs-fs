import folders from './folders';
import { ResolverMap } from '../../typings/globals';

export const resolver: ResolverMap = {
  Query: {
    folderExists: (_root, args: HDS.IFolderExistsOnQueryArguments) =>
      folders.isDirectory(args.file)
  }
};

// export default resolver;
