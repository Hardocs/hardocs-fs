import * as path from 'path';
import * as fs from 'fs-extra';
import * as winattr from 'winattr';

import { Options, GeneratedFolder, Path } from '../../typings/globals';
import cwd from '../cwd';
import { getHardocsDir } from './../../utils/constants';
import file from '../file';

const isPlatformWindows =
  process.platform.indexOf('win') === 0 || process.platform.includes('win');
const hiddenPrefix = '.';

const isDirectory = ({ path: file }: Path) => {
  file = file.replace(/\\/g, path.sep);
  try {
    return fs.existsSync(file) && fs.statSync(file).isDirectory();
  } catch (err) {
    console.log(err.message);
  }
  return false;
};

const generateFolder = ({ path: file }: Path): GeneratedFolder => {
  return {
    name: path.basename(file),
    path: file
  };
};

const getCurrent = () => {
  const baseDir = cwd.get();
  return generateFolder({ path: baseDir });
};

const open = async ({ path: file }: Path) => {
  await cwd.set(file);
  return generateFolder({ path: cwd.get() });
};

const openParent = ({ path: file }: Path) => {
  const newPath = path.dirname(file);
  cwd.set(newPath);
  return generateFolder({ path: cwd.get() });
};

const createFolder = ({ path: name }: Path) => {
  if (isDirectory({ path: name })) {
    console.log(`Folder already exist.`);
    return false;
  }

  const folder = path.join(cwd.get(), name);
  fs.ensureDirSync(folder);
  return generateFolder({ path: folder });
};

const list = async ({ path: base }: Path) => {
  let dir = base;
  if (isPlatformWindows) {
    if (base.match(/^([A-Z]{1}:)$/)) {
      dir = path.join(base, '\\');
    }
  }

  const files = fs.readdirSync(dir, 'utf8');
  return files
    .map((file) => {
      const folderPath = path.join(base, file);
      return {
        path: folderPath,
        name: file,
        hidden: isHidden({ path: folderPath })
      };
    })
    .filter((file) => isDirectory({ path: file.path }));
};

const isHidden = ({ path: file }: Path) => {
  try {
    const prefixed = path.basename(file).charAt(0) === hiddenPrefix;
    const result = {
      unix: prefixed,
      windows: false
    };

    if (isPlatformWindows) {
      const windowsFile = file.replace(/\\/g, '\\\\');
      result.windows = winattr.getSync(windowsFile).hidden;
    }

    return (
      (!isPlatformWindows && result.unix) ||
      (isPlatformWindows && result.windows)
    );
  } catch (er) {
    if (process.env.HARDOCS_DEV_MODE) {
      console.log('File: ' + file);
      return console.log(er);
    }
  }
};

const readPackage = async (options: Partial<Options>) => {
  const { path: file = '', force = false } = options;

  if (!force) {
    // const cachedValue = await redis.get(`${READ_PACKAGE_PREFIX}${file}`);
    // if (cachedValue) {
    //   return cachedValue;
    // }
  }

  // Hardocs hidden folder
  const hardocsDir = getHardocsDir(file);
  const hardocsPkg = path.join(hardocsDir, 'hardocs.json');

  if (isDirectory({ path: hardocsDir })) {
    if (fs.existsSync(hardocsPkg)) {
      const pkg = fs.readJsonSync(hardocsPkg);
      return pkg;
    } else {
      console.log('Not a hardocs directory');
      return false;
    }
  }
};

const isHardocsProject = async ({
  path
}: Partial<Options>): Promise<boolean> => {
  try {
    const pkg = await readPackage({ path });
    return !!pkg;
  } catch (er) {
    if (process.env.HARDOCS_DEV_MODE) {
      console.log(`${er} This is not a HARDOCS projects`);
    }
    return false;
  }
};

const getDocsFolder = async ({ path, force }: Partial<Options>) => {
  let fromBaseDir = cwd.get();
  if (force) {
    if (path) {
      fromBaseDir = path;
    }
  }
  if (!isHardocsProject({ path: fromBaseDir })) {
    throw new Error('Not a hardocs project');
  }

  const hardocsJson = (
    await file.getHardocsJsonFile({ path: fromBaseDir, force })
  ).hardocsJson;
  const { docsDir } = hardocsJson;

  return `${fromBaseDir}/${docsDir}`;
};

const deleteFolder = async ({ path }: Path): Promise<boolean> => {
  await fs.remove(path);
  return true;
};

export default {
  isDirectory,
  generateFolder,
  getCurrent,
  open,
  openParent,
  createFolder,
  list,
  isHidden,
  getDocsFolder,
  readPackage,
  isHardocsProject,
  deleteFolder
};
