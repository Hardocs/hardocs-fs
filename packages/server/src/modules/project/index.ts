import * as path from 'path';
import * as fs from 'fs-extra';
// import * as glob from 'glob';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { getHardocsDir } from './../../utils/constants';

const templateDir = path.join(__dirname, '../../../template');

const openProject = async ({
  path,
  fullPath = false
}: HDS.IOpenProjectOnQueryArguments) => {
  let currentDir = cwd.get();
  if (fullPath) {
    if (path) {
      currentDir = path;
    } else {
      throw new Error(logs.chalk.red('Please specify a valid path'));
    }
  }
  const hardocsDir = getHardocsDir(currentDir);
  console.log(hardocsDir);

  if (!folder.isDirectory({ path: currentDir })) {
    throw new Error(logs.chalk.red('Not a valid directory'));
  }
  const allMarkdownFiles = await fs.readdirSync(currentDir);
  console.log(allMarkdownFiles);
};

const create = async ({ input }: HDS.ICreateProjectOnMutationArguments) => {
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
      openProject({});
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
