import * as path from 'path';
import * as fs from 'fs-extra';
// import glob from 'glob';

import cwd from '../cwd/cwd';
import folder from '../folder';

const templateDir = path.join(__dirname, '../../../template');

const allDocs = async ({ input }: HDS.ICreateProjectOnMutationArguments) => {
  const docDir = `${templateDir}/${input.docsDir}`;
  const doc = input.allDocs && input.allDocs[0];
  const fullPath = docDir + '/' + doc?.fileName;
  const file = fs.readFileSync(fullPath, 'utf-8');
  console.log(file);
};

const create = async ({ input }: HDS.ICreateProjectOnMutationArguments) => {
  if (input) {
    allDocs({ input });
    const dest = path.join(cwd.get(), input.name);
    await cwd.set(dest);
    if (!folder.isDirectory({ path: dest })) {
      await fs.ensureDir(dest);
    }
    try {
      const result = {
        id: Math.round(Math.abs(Math.random() * new Date().getTime())),
        ...input,
        updatedAt: new Date().toISOString()
      };

      const hardocsDir = path.join(dest, '.hardocs');
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
      return result;
    } catch (er) {
      throw new Error(er);
    }
  }
  return false;
};

export default {
  create,
  allDocs
};
