import * as path from 'path';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';

const create = async (input: { folder: string }) => {
  const targetDir = path.join(cwd.get(), input.folder);

  await cwd.set(targetDir);
  console.log(cwd.get());
  // const inCurrent = input.folder === '.';
  const dir = path.join(__dirname, '../../../template');
  const dest = `${cwd.get()}/${input.folder}`;

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
      folder: input.folder
    };
  } catch (er) {
    throw new Error(er);
  }
};

export default {
  create
};
