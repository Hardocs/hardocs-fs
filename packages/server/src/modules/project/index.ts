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
}: Partial<Options> & ContextOnly & { fullPath?: boolean }) => {
  let currentDir = cwd.get();
  if (fullPath) {
    if (path) {
      currentDir = path;
    } else {
      throw new Error(logs.chalk.red('Please specify a valid path'));
    }
  }

  const hardocsDir = getHardocsDir(currentDir);

  if (!folder.isDirectory({ path: currentDir })) {
    throw new Error(logs.chalk.red('Not a valid directory'));
  }
  if (!folder.isHardocsProject({ path: currentDir, context })) {
    throw new Error(logs.chalk.red('Not a valid hardocs project'));
  }
  const hardocsFile = await fs.readFile(`${hardocsDir}/hardocs.json`, {
    encoding: 'utf8'
  });
  const hardocsJson = JSON.parse(hardocsFile);
  const docsDir = hardocsJson.docsDir;
  if (!docsDir || docsDir.trim() === '') {
    logs.chalk.red('No documentations provided');
    return;
  }
  file.getEntryFile({ path: currentDir, context });
};

const create = async ({
  input,
  context
}: HDS.ICreateProjectOnMutationArguments & ContextOnly) => {
  if (input) {
    const dest = path.join(cwd.get(), input.name);
    await cwd.set(dest);
    if (!folder.isDirectory({ path: dest })) {
      await fs.ensureDir(dest);
      await cwd.set(dest);
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
