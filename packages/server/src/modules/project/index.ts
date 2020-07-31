import { Options, ContextOnly } from './../../typings/globals';
import * as path from 'path';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { getHardocsDir } from './../../utils/constants';
import file from '../file';

const templateDir = path.join(__dirname, '../../../template');

const openProject = async ({
  path,
  context,
  fullPath = false
}: Partial<Options> & ContextOnly) => {
  const hardocsJson = await file.getHardocsJsonFile({
    path,
    context,
    fullPath
  });
  const docsDir = hardocsJson.hardocsJson.docsDir;

  if (!docsDir || docsDir.trim() === '') {
    logs.chalk.red('No documentations provided');
    return;
  }
};

const create = async ({
  input,
  context
}: HDS.ICreateProjectOnMutationArguments & ContextOnly) => {
  if (input) {
    const dest = path.join(cwd.get(), input.name);
    await cwd.set(dest);
    if (!folder.isDirectory({ path: dest })) {
      try {
        await fs.mkdir(dest);
        await cwd.set(dest);
      } catch (er) {
        throw new Error(logs.chalk.red(er.message));
      }
    }
    try {
      const result = {
        id: Math.round(Math.abs(Math.random() * new Date().getTime())),
        ...input,
        updatedAt: new Date().toISOString()
      };
      const hardocsDir = getHardocsDir(dest);
      await fs.ensureDir(hardocsDir);
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      if (folder.isDirectory({ path: templateDir })) {
        await fs.copy(templateDir, dest);
      }
      const stream = fs.createWriteStream(hardocsJson, {
        encoding: 'utf8',
        flags: 'w+'
      });

      stream.write(JSON.stringify(result, null, 2), (err) => {
        if (err) {
          console.log(err.message);
        }
      });
      openProject({ context }); // Open project before requiring any files in it
      return result;
    } catch (er) {
      throw new Error(er);
    }
  }
  return false;
};

export default {
  create
};
