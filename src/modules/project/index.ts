import { Options } from './../../typings/globals';
import * as path from 'path';
import * as fs from 'fs-extra';

import cwd from '../cwd';
import folder from '../folder';
import { getHardocsDir } from './../../utils/constants';
import file from '../file';

const templateDir = path.join(__dirname, '../../../template/template'); // TODO: Include template
const markdownFile = path.join(
  __dirname,
  '../../../template/docsTemplate/index.md'
);
// const docsTemplateDir = path.join(__dirname, '../../../template/docsTemplate');

const openProject = async ({
  path: fullPath,
  force = false
}: Options): Promise<HDS.IProject | HDS.IError> => {
  if (!fullPath) {
    fullPath = cwd.get();
  }
  cwd.set(fullPath);

  const hardocsJson = await file.getHardocsJsonFile({
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
    try {
      const result = {
        id: Math.round(Math.abs(Math.random() * new Date().getTime())),
        ...input,
        updatedAt: 'new Date().toISOString()'
      };
      const hardocsDir = getHardocsDir(dest);
      await fs.ensureDir(hardocsDir);
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      const docsDir = `${dest}/${result.docsDir}`;

      if (folder.isDirectory({ path: templateDir })) {
        await fs.copy(templateDir, dest);
        // await fs.copy(docsTemplateDir, docsDir); // TODO: Copy docs template if provided
      }

      await fs.ensureDir(docsDir);
      await file.createMarkdownTemplate(
        markdownFile,
        result.entryFile,
        docsDir
      );

      const stream = fs.createWriteStream(hardocsJson, {
        encoding: 'utf8',
        flags: 'w+'
      });

      stream.write(JSON.stringify(result, null, 2), (err) => {
        if (err) {
          console.log(err.message);
        }
      });

      const response = await openProject({ path: cwd.get() }); // Open project before requiring any files in it

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

const createFromExisting = async ({
  input
}: HDS.ICreateProjectFromExistingOnMutationArguments) => {
  if (input) {
    const projectPath = input.path || cwd.get();
    const dest = projectPath;
    if (!folder.isDirectory({ path: dest })) {
      throw new Error(`${dest} is Not a valid path`);
    }
    await cwd.set(dest);
    try {
      const result = {
        id: String(Math.round(Math.abs(Math.random() * new Date().getTime()))),
        ...input,
        updatedAt: 'new Date().toISOString()'
      } as HDS.IProject;
      const hardocsDir = getHardocsDir(dest);
      await fs.ensureDir(hardocsDir);
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      const docsDir = `${dest}/${result.docsDir}`;

      if (folder.isDirectory({ path: templateDir })) {
        // await fs.copy(templateDir, dest);
        // await fs.copy(docsTemplateDir, docsDir);
        await fs.ensureDir(docsDir);
        if (!file.exists(`${docsDir}/${result.entryFile}`)) {
          await file.createMarkdownTemplate(
            markdownFile,
            result.entryFile,
            docsDir
          );
        }
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

      const response = openProject({ path: dest }); // Open project before requiring any files in it

      return response;
    } catch (er) {
      throw new Error(er);
    }
  }
  return false;
};

export default {
  create,
  open: openProject,
  createFromExisting
};
