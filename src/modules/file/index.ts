import glob from 'glob';
import * as fs from 'fs';

import cwd from '../cwd';
import folder from '../folder';
import { Options, Path } from '../../typings/globals';
import { getHardocsDir } from './../../utils/constants';

// const dom = new jsdom.JSDOM();

const openFile = ({ path: filePath, force = false }: Options) => {
  try {
    if (!filePath) {
      filePath = cwd.get();
    }
    const readFile = fs.readFileSync(filePath, 'utf-8');

    const regex = /<[^>].+?>(.*?)<\/.+?>/m;
    const newRegex = /(<([^>]+)>)/gi;

    let title = 'Please specify a title';

    const newTitle = readFile.match(regex);

    if (newTitle) {
      title = newTitle[0];
    }

    title = title.replace(newRegex, '').trim();
    title = title.replace(/&nbsp;/g, '');

    return {
      title,
      content: readFile,
      fileName: getFileName({ path: filePath }),
      path: force ? filePath : `${cwd.get()}/${filePath}`
    };
  } catch (er) {
    throw new Error(er.message);
  }
};

const writeToFile = async (
  input: HDS.IFileInput
): Promise<boolean | HDS.IError> => {
  const { path, content, fileName } = input;
  if (!input) {
    throw new Error('Input all fields');
  }

  const newPath = `${path}/${fileName}`;
  try {
    fs.writeFileSync(newPath, content, { encoding: 'utf8' });

    return true;
  } catch (er) {
    return {
      error: true,
      message: er.message
    };
  }
};

/**
 *
 * @param filePath <Optional> Specify if you want to read from another directory
 */
const allHtmlFilesPath = (filePath?: string) => {
  if (!filePath) {
    filePath = cwd.get();
  }
  const allHtmls = glob.sync(`${filePath}/**/*.html`);
  return allHtmls;
};

const getEntryFilePath = async ({
  path: projectPath,
  force
}: Options): Promise<string> => {
  if (!force) {
    projectPath = `${cwd.get()}/${projectPath}`;
  }

  if (!folder.isHardocsProject({ path: projectPath, force })) {
    throw new Error('Not a valid hardocs project -- getEntryFilePath');
  }

  try {
    const docsDir = await folder.getDocsFolder({
      path: projectPath,
      force
    });

    const entryFileName = getHardocsJsonFile({ path: projectPath, force })
      .hardocsJson.metadata;

    const entryFile = `${docsDir}/${entryFileName}`;
    return entryFile;
  } catch (err) {
    return 'Not a valid project';
  }
};

const getHardocsJsonFile = ({
  path,
  force = false
}: Partial<Options>): {
  hardocsJson: HDS.IProject;
  currentDir: string;
} => {
  if (force && !path) {
    throw new Error('Please specify path when using `force: true` option..');
  }
  if (!path) {
    path = cwd.get();
  }

  const hardocsDir = getHardocsDir(path);

  if (!folder.isHardocsProject({ path, force })) {
    throw new Error('Not a valid hardocs project -- getHardocsJsonFile');
  }
  const hardocsFile: string = fs.readFileSync(
    `${hardocsDir}/hardocs.json`,
    'utf-8'
  );
  const hardocsJson = JSON.parse(hardocsFile);
  return { hardocsJson, currentDir: path };
};

const createHtmlTemplate = async (filename: string, path: string) => {
  try {
    // const data = fs.readFileSync(entryPath, 'utf-8');

    const data = `<h1>Index</h1>
    <p>You can change the title of this document but in the file system will always remain as <code>index.html</code></p>
    `;

    const newFile = fs.writeFileSync(`${path}/${filename}`, data, {
      flag: 'w+'
    });
    return newFile;
  } catch (er) {
    throw new Error('there was a problem: ' + er);
  }
};

const openEntryFile = async ({ path, force }: Options) => {
  if (!force) {
    path = `${cwd.get()}/${path}`;
  }

  const metadata = openFile({ path, force: false });
  return metadata;
};

const extractAllFileData = async ({ path }: Options) => {
  const allHtmlFilesPathPath = allHtmlFilesPath(path);
  try {
    return allHtmlFilesPathPath.map((f) => {
      const d = openFile({ path: f, force: false });
      // const d = await openFile({ filePath: f });

      const data = {
        // title: d.title,
        // description: d.description,
        // fileName: getFileName({ path: f }),
        // fullPath: `${cwd.get()}/${d.path}`,
        ...d
        // content: '' TODO: return only entry file contents
      };
      return data;
    });
  } catch (er) {
    throw new Error('Error occurred :(');
  }
};

const getFileName = ({ path }: Path) => {
  const fullPath = path.split(/\//gis);
  const lastIndex = fullPath[fullPath.length - 1];
  return lastIndex.toString().includes(`.html`) && lastIndex;
};

const exists = (path: string): boolean => {
  return fs.existsSync(path);
};

const deleteFile = ({
  filePath
}: HDS.IDeleteFileOnMutationArguments): boolean | HDS.IError => {
  if (folder.isDirectory({ path: filePath })) {
    return {
      error: true,
      message: 'File path must point to a valid file and not a directory'
    };
  }

  if (!exists(filePath)) {
    return {
      error: true,
      message: "File doesn't exist"
    };
  }
  fs.stat(filePath, (err, stat) => {
    if (err) {
      return {
        error: true,
        message: err.message
      };
    }

    // Already handled this in the upper scope, however, we want to avoid errors as much as possible
    if (stat.isDirectory()) {
      return {
        error: true,
        message: "Method doesn't support deleting of directories."
      };
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        return {
          error: true,
          message: err.message
        };
      }
      return true;
    });
    return true;
  });

  return true;
};
export default {
  openFile,
  allHtmlFilesPath,
  getEntryFilePath,
  getHardocsJsonFile,
  createHtmlTemplate,
  openEntryFile,
  extractAllFileData,
  getFileName,
  writeToFile,
  delete: deleteFile,
  exists
};
