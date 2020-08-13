import { Options, ContextOnly } from './../../typings/globals';
import * as path from 'path';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { getHardocsDir } from './../../utils/constants';
import file from '../file';

const templateDir = path.join(__dirname, '../../../template/template');
const markdownFile = path.join(
  __dirname,
  '../../../template/docsTemplate/index.md'
);
const docsTemplateDir = path.join(__dirname, '../../../template/docsTemplate');

const openProject = async ({
  path,
  context,
  force = false
}: Partial<Options> & ContextOnly) => {
  const hardocsJson = await file.getHardocsJsonFile({
    path,
    context,
    force
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

      const docsDir = `${dest}/${result.docsDir}`;

      if (folder.isDirectory({ path: templateDir })) {
        await fs.copy(templateDir, dest);
        await fs.copy(docsTemplateDir, docsDir);
        await fs.ensureDir(docsDir);
        await file.createMarkdownTemplate(
          markdownFile,
          result.entryFile,
          docsDir
        );
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

      const entryFilePath = `${docsDir}/${result.entryFile}`;

      const allFileData = await file.extractAllFileData({ path: docsDir });
      // console.log(allFileData);
      // const data = allFileData.find((val) => val.fileName === 'index.md');

      const entry = await file.extractEntryFileData({
        path: entryFilePath,
        context
      });

      const allDocsData = allFileData.map((f) => {
        if (f.fileName === file.getFileName({ path: entryFilePath })) {
          f.content = entry.content;
        }
        return f;
      });

      openProject({ context }); // Open project before requiring any files in it

      return {
        ...result,
        allDocsData
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
