import * as fs from 'fs';
import * as path from 'path';
import { v4 as UUIDv4 } from 'uuid';
import cwd from '../cwd';
import file from '../file';
import folder from '../folder';
import metadata from '../metadata';
import { Options } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';

const openProject = async ({
  path: fullPath,
  force = false
}: Partial<Options>): Promise<HDS.IProject | HDS.IError> => {
  if (force && !fullPath) {
    return {
      error: true,
      message:
        'Please specify path when using `force: true` option. --openProject--'
    };
  }

  if (!fullPath) {
    fullPath = cwd.get();
  }

  await cwd.set(fullPath);

  try {
    const { hardocsJson } = file.getHardocsJsonFile({
      path: fullPath,
      force
    });

    const docsDir = hardocsJson.docsDir;

    if (!docsDir || docsDir.trim() === '') {
      return {
        error: true,
        message: 'No Docs directory specified in ".hardocs/hardocs.json"'
      };
    }

    const allDocsData = await file.extractAllFileData({ path: docsDir });

    const data = await metadata.loadMetadataAndSchema(hardocsJson);

    const response = {
      ...data,
      allDocsData: [...data.allDocsData, ...allDocsData],
      path: fullPath
    };

    return response;
  } catch (err) {
    return {
      error: true,
      message: 'Not a valid hardocs project. message: ' + err.message
    };
  }
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
      ...input,
      id: UUIDv4(),
      path: projectPath,
      allDocsData: {}
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

      // Generate default schema

      await metadata.generateMetadata({
        docsDir: input.docsDir,
        path: dest,
        schemaUrl: 'https://json.schemastore.org/esmrc.json',
        label: 'default'
      });
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
  if (!input.path) {
    throw new Error('Please specify a path -- createProjectFromExistingFolder');
  }
  if (input) {
    await cwd.set(input.path);
    if (!folder.isDirectory({ path: input.path })) {
      fs.mkdirSync(input.path);
      await cwd.set(input.path);
    }

    try {
      const result = {
        ...input,
        id: UUIDv4(),
        allDocsData: {}
      };
      const hardocsDir = getHardocsDir(input.path);

      if (!fs.existsSync(hardocsDir)) {
        fs.mkdirSync(hardocsDir);
      }
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      await fs.promises.writeFile(
        hardocsJson,
        JSON.stringify(result, null, 2),
        { encoding: 'utf-8' }
      );
      // Promise.resolve().then(() => writeToJson(hardocsJson, result));

      const docsDir = `${input.path}/${result.docsDir}`;
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      await metadata.generateMetadata({
        docsDir: input.docsDir,
        path: input.path,
        schemaUrl: 'https://json.schemastore.org/esmrc.json',
        label: 'default'
      });
      const response = await openProject({ path: input.path, force: true }); // Open project before requiring any files in it
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
