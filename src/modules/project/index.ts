import * as fs from 'fs';
import * as path from 'path';
import { v4 as UUIDv4 } from 'uuid';
import cwd from '../cwd';
import file from '../file';
import folder from '../folder';
import metadata from '../metadata';
import { defaultStandard } from '../metadata/defaultStandard';
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

    const allDocsData = await file.extractAllFileData({ path: docsDir });

    const schema = await metadata.loadSchema('schema');
    const metadataContent = await metadata.loadMetadata(
      fullPath,
      docsDir,
      'schema'
    );

    // const metadata = await loadMetadata(fullPath, docsDir);

    const response = {
      ...hardocsJson.hardocsJson,
      path: fullPath,
      allDocsData,
      schema,
      metadata: metadataContent,
      __typename: 'Project'
    } as HDS.IProject;

    return response;
  } catch (err) {
    return {
      error: true,
      message: 'Not a valid hardocs project. message: ' + err.message // TODO: Return proper error message
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
      id: UUIDv4(),
      ...input
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

      // await file.createHtmlTemplate(result.entryFile, docsDir);

      // Generate default schema

      await metadata.bootstrapSchema({ content: defaultStandard });
      await metadata.generateMetadata({
        docsDir: input.docsDir,
        path: dest,
        content: {}
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
  if (input) {
    const projectPath = input.path || cwd.get();
    await cwd.set(projectPath);
    if (!folder.isDirectory({ path: projectPath })) {
      fs.mkdirSync(projectPath);
      await cwd.set(projectPath);
    }

    try {
      const result = {
        id: UUIDv4(),
        ...input
      };
      const hardocsDir = getHardocsDir(projectPath);

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

      const docsDir = `${projectPath}/${result.docsDir}`;
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      // if (!file.exists(`${docsDir}/${result.entryFile}`)) {
      //   await file.createHtmlTemplate(result.entryFile, docsDir);
      // }

      // If we do not have a schema then we have to create a new one
      if (!fs.existsSync(`${hardocsDir}/schema.json`)) {
        await metadata.bootstrapSchema({ content: defaultStandard });
      }

      // If we do not have a metadata, then we have to create a new one
      if (!fs.existsSync(`${hardocsDir}/metadata.json`)) {
        await metadata.generateMetadata({
          docsDir: input.docsDir,
          path: projectPath,
          content: {}
        });
      }
      const response = await openProject({ path: projectPath, force: true }); // Open project before requiring any files in it
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
