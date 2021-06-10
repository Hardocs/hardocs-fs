import * as fs from 'fs';
import glob from 'glob';
import { Options } from '../../typings/globals';
import cwd from '../cwd';
import folder from '../folder';
import { getHardocsDir } from './../../utils/constants';

// const dom = new jsdom.JSDOM();

const openFile = (path: string) => {
  try {
    if (!path) {
      path = cwd.get();
    }
    const readFile = fs.readFileSync(path, 'utf-8');

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
      fileName: getFileName(path),
      path
    };
  } catch (er: any) {
    throw new Error(er.message);
  }
};

const writeToFile = async (
  input: HDS.IFileInput
): Promise<boolean | HDS.IError> => {
  const { path, content } = input;
  if (!input) {
    throw new Error('Input all fields');
  }

  const newPath = path;
  try {
    fs.writeFileSync(newPath, content, { encoding: 'utf8' });

    return true;
  } catch (er: any) {
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

const getHardocsJsonFile = (
  path: string
): {
  hardocsJson: HDS.IProject;
  hardocsDir: string;
} => {
  if (!path) {
    throw new Error('Please specify path when using `force: true` option..');
  }

  const hardocsDir = getHardocsDir(path);

  if (!folder.isHardocsProject(path)) {
    throw new Error('Not a valid hardocs project -- getHardocsJsonFile');
  }
  const hardocsFile: string = fs.readFileSync(
    `${hardocsDir}/hardocs.json`,
    'utf-8'
  );
  const hardocsJson = JSON.parse(hardocsFile);
  return { hardocsJson, hardocsDir };
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

  const metadata = openFile(path);
  return metadata;
};

const extractAllFileData = async ({ path }: Options) => {
  const allHtmlFilesPathPath = allHtmlFilesPath(path);
  try {
    return allHtmlFilesPathPath.map((f) => {
      return openFile(f);
    });
  } catch (er) {
    throw new Error('Error occurred :(');
  }
};

const getFileName = (path: string) => {
  const fullPath = path.split(/\//gis);
  const lastIndex = fullPath[fullPath.length - 1];
  return lastIndex.toString().includes(`.html`) && lastIndex;
};

const exists = (path: string): boolean => {
  return fs.existsSync(path);
};

const deleteFile = (path: string): boolean | HDS.IError => {
  if (folder.isDirectory(path)) {
    return {
      error: true,
      message: 'File path must point to a valid file and not a directory'
    };
  }

  if (!exists(path)) {
    return {
      error: true,
      message: "File doesn't exist"
    };
  }
  fs.stat(path, (err, stat) => {
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
    fs.unlink(path, (err) => {
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
  // getEntryFilePath,
  getHardocsJsonFile,
  createHtmlTemplate,
  openEntryFile,
  extractAllFileData,
  getFileName,
  writeToFile,
  delete: deleteFile,
  exists
};
