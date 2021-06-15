import * as fs from 'fs';
import * as path from 'path';
import file from '../file';
import folder from '../folder';
import metadata from '../metadata';
import { Options } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';

const openProject = async ({
  path: basePath
}: Partial<Options>): Promise<HDS.IProject | HDS.IError> => {
  if (!basePath) {
    return {
      error: true,
      message:
        'Please specify path when using `force: true` option. --openProject--'
    };
  }

  try {
    const { hardocsJson } = file.getHardocsJsonFile(basePath);

    const docsDir = hardocsJson.docsDir;

    if (!docsDir || docsDir.trim() === '') {
      return {
        error: true,
        message: 'No Docs directory specified in ".hardocs/hardocs.json"'
      };
    }

    const hardocs = await file
      .extractAllFileData({
        path: `${basePath}/${docsDir}`
      })
      .then((v) =>
        v.map((doc: any) => {
          doc.path = `${docsDir}/${doc.fileName}`;
          return doc;
        })
      );

    const data = await metadata.loadMetadataAndSchema(hardocsJson, basePath);
    const response = {
      ...data,
      hardocs: [...data.hardocs, ...hardocs],
      path: basePath
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
    const dest = path.join(input.path, input.name);
    if (!folder.isDirectory(dest)) {
      fs.mkdirSync(dest);
    }
    const hardocsDir = getHardocsDir(dest);

    try {
      if (!fs.existsSync(hardocsDir)) {
        fs.mkdirSync(hardocsDir);
      }
      const hardocsJson = `${hardocsDir}/hardocs.json`;

      const docsDir = `${dest}/${input.docsDir}`;
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
      }

      const result = {
        name: input.name,
        docsDir: input.docsDir,
        hardocs: []
      };
      await fs.promises.writeFile(
        hardocsJson,
        JSON.stringify(result, null, 2),
        { encoding: 'utf-8' }
      );

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
  open: openProject
  // createFromExisting
};

// const createFromExisting = async (
//   input: HDS.ICreateProjectInput
// ): Promise<HDS.IProject | HDS.IError> => {
//   if (!input.path) {
//     throw new Error('Please specify a path -- createProjectFromExistingFolder');
//   }
//   if (input) {
//     await cwd.set(input.path);
//     if (!folder.isDirectory(input.path)) {
//       fs.mkdirSync(input.path);
//       await cwd.set(input.path);
//     }

//     try {
//       const result = {
//         ...input,
//         id: UUIDv4(),
//         hardocs: []
//       };

//       const hardocsDir = getHardocsDir(input.path);

//       if (!fs.existsSync(hardocsDir)) {
//         fs.mkdirSync(hardocsDir);
//       }
//       const hardocsJson = `${hardocsDir}/hardocs.json`;

//       await fs.promises.writeFile(
//         hardocsJson,
//         JSON.stringify(result, null, 2),
//         { encoding: 'utf-8' }
//       );

//       const docsDir = `${input.path}/${result.docsDir}`;
//       if (!fs.existsSync(docsDir)) {
//         fs.mkdirSync(docsDir);
//       }

//       await metadata.processMetadata({
//         docsDir: input.docsDir,
//         path: input.path,
//         schemaUrl: 'https://json.schemastore.org/esmrc.json',
//         label: 'default'
//       });
//       const response = await openProject({ path: input.path, force: true }); // Open project before requiring any files in it
//       return response;
//     } catch (er) {
//       return {
//         error: true,
//         message: er.message
//       };
//     }
//   }
//   return {
//     error: true,
//     message: 'Please specify a project path'
//   };
// };
