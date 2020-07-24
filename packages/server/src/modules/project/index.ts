import * as path from 'path';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';

const create = async ({ input }: HDS.ICreateProjectOnMutationArguments) => {
  // console.log(input);
  if (input) {
    const dest = path.join(cwd.get(), input.name);
    await cwd.set(dest);
    // const inCurrent = input.folder === '.';
    const dir = path.join(__dirname, '../../../template');
    if (!folder.isDirectory({ path: dest })) {
      await fs.mkdir(dest);
    }
    try {
      if (
        folder.isDirectory({ path: dir }) &&
        folder.isDirectory({ path: dest })
      ) {
        await fs.copy(dir, dest);
      }
      return {
        ...input,
        updatedAt: new Date().toISOString(),
        id: Math.round(Math.abs(Math.random() * new Date().getTime()))
      };
    } catch (er) {
      throw new Error(er);
    }
  }
  return false;
};

export default {
  create
};
