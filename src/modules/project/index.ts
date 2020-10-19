import { Options } from './../../typings/globals';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as UUIDv4 } from 'uuid';

import cwd from '../cwd';
import folder from '../folder';
import { getHardocsDir } from './../../utils/constants';
import file from '../file';

// const templateDir = path.join(__dirname, '../../../template/template'); // TODO: Include template
// const markdownFile = path.join(
//   __dirname,
//   '../../../template/docsTemplate/index.md'
// );
// const docsTemplateDir = path.join(__dirname, '../../../template/docsTemplate');

const openProject = async ({
  path: fullPath,
  force = false
}: Partial<Options>): Promise<HDS.IProject | HDS.IError> => {
  if (force && !fullPath) {
    return {
      error: true,
      message: 'Please specify path when using `force: true` option..'
    };
  }

  if (!fullPath) {
    fullPath = cwd.get();
  }

  await cwd.set(fullPath);

  const hardocsJson = file.getHardocsJsonFile({
    path: fullPath,
    force
  });

  const docsDir = hardocsJson.hardocsJson.docsDir;

  if (!docsDir || docsDir.trim() === '') {
    return {
      error: true,
      message: 'No Docs directory specified in ".hardocs/hardocs.json"'
    };
  }

  const entryFilePath = `${docsDir}/${hardocsJson.hardocsJson.entryFile}`;
  const allFileData = await file.extractAllFileData({ path: docsDir });

  const entry = await file.openEntryFile({
    path: entryFilePath
  });
  const allDocsData = allFileData
    .map((f) => {
      if (f.fileName === file.getFileName({ path: entryFilePath })) {
        f.content = entry.content;
      }
      return f;
    })
    .sort((a) => (a.fileName === entry.fileName ? -1 : 1));

  const response = {
    ...hardocsJson.hardocsJson,
    path: fullPath,
    allDocsData,
    __typename: 'Project'
  } as HDS.IProject;

  return response;
};

/**
 *
 * @param path file path you want to write to
 * @param data the content you want to write into the file
 */
const writeToJson = async (path: string, data: any) => {
  const stream = fs.createWriteStream(path, {
    encoding: 'utf8',
    flags: 'w+'
  });

  stream.once('ready', () => {
    stream.write(JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err.message);
      }
    });
    // console.log('Finished stream');
  });
};

const create = async (
  input: HDS.ICreateProjectInput
): Promise<HDS.IProject | HDS.IError> => {
  if (input) {
    const projectPath = input.path || cwd.get();
    const dest = path.join(projectPath, input.name);
    await cwd.set(dest);
    if (!folder.isDirectory({ path: dest })) {
      fs.mkdirSync(dest);
      await cwd.set(dest);
    }

    const result = {
      id: UUIDv4(),
      ...input,
      updatedAt: 'new Date().toISOString()'
    };
    try {
      const hardocsDir = getHardocsDir(dest);

      if (!fs.existsSync(hardocsDir)) {
        fs.mkdirSync(hardocsDir);
      }
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      await fs.promises.writeFile(
        hardocsJson,
        JSON.stringify(result, null, 2),
        { encoding: 'utf-8' }
      );

      const docsDir = `${dest}/${result.docsDir}`;
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      await file.createMarkdownTemplate(result.entryFile, docsDir);

      const response = await openProject({ path: dest, force: true }); // Open project before requiring any files in it

      return response;
    } catch (er) {
      return {
        error: true,
        message: er.message
      };
    }
  }
  return {
    error: true,
    message: 'Please specify a project path'
  };
};

const createFromExisting = async (
  input: HDS.ICreateProjectInput
): Promise<HDS.IProject | HDS.IError> => {
  if (input) {
    const projectPath = input.path || cwd.get();
    const dest = path.join(projectPath, input.name);
    await cwd.set(dest);
    if (!folder.isDirectory({ path: dest })) {
      fs.mkdirSync(dest);
      await cwd.set(dest);
    }

    try {
      const result = {
        id: UUIDv4(),
        ...input,
        updatedAt: 'new Date().toISOString()'
      };
      const hardocsDir = getHardocsDir(dest);

      if (!fs.existsSync(hardocsDir)) {
        fs.mkdirSync(hardocsDir);
      }
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      setTimeout(async () => {
        writeToJson(hardocsJson, result);
      }, 0);

      // Promise.resolve().then(() => writeToJson(hardocsJson, result));

      const docsDir = `${dest}/${result.docsDir}`;
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      if (!file.exists(`${docsDir}/${result.entryFile}`)) {
        await file.createMarkdownTemplate(result.entryFile, docsDir);
      }

      const response = await openProject({ path: dest, force: true }); // Open project before requiring any files in it

      return response;
    } catch (er) {
      return {
        error: true,
        message: er.message
      };
    }
  }
  return {
    error: true,
    message: 'Please specify a project path'
  };
};

export default {
  create,
  open: openProject,
  createFromExisting
};
