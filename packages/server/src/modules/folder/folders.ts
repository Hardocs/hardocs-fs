import { READ_PACKAGE_PREFIX } from './constants';
import { Redis } from 'ioredis';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as winattr from 'winattr';

import { GeneratedFolder } from './../../typings/globals';
import logs from '../../utils/logs';
import cwd from '../cwd/cwd';

const isPlatformWindows =
  process.platform.indexOf('win') === 0 || process.platform.includes('win');
const hiddenPrefix = '.';

const isDirectory = (file: string) => {
  file = file.replace(/\\/g, path.sep);
  try {
    return fs.statSync(file).isDirectory();
  } catch (err) {
    logs.Warn(err.message);
  }
  return false;
};

const generateFolder = (file: string): GeneratedFolder => {
  return {
    name: path.basename(file),
    path: file
  };
};

const getCurrent = (_file: any) => {
  const baseDir = cwd.get();
  return generateFolder(baseDir);
};

const open = async (file: string) => {
  await cwd.set(file);
  return generateFolder(cwd.get());
};

const openParent = (file: string) => {
  const newPath = path.dirname(file);
  cwd.set(newPath);
  return generateFolder(cwd.get());
};

const createFolder = (name: string) => {
  const folder = path.join(cwd.get(), name);
  fs.mkdirpSync(folder);
  return generateFolder(folder);
};

const list = async (base: string) => {
  let dir = base;
  if (isPlatformWindows) {
    if (base.match(/^([A-Z]{1}:)$/)) {
      dir = path.join(base, '\\');
    }
  }

  const files = await fs.readdirSync(dir, 'utf8');
  return files
    .map((file) => {
      const folderPath = path.join(base, file);
      return {
        path: folderPath,
        name: file,
        hidden: isHidden(folderPath)
      };
    })
    .filter((file) => isDirectory(file.path));
};

const isHidden = (file: string) => {
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
      logs.Warn('File: ' + file);
      return logs.Err(er);
    }
  }
};

// const isPackage = (file: string): boolean => {
//   try {
//     return fs.existsSync(path.join(file, 'package.json'));
//   } catch (er) {
//     logs.Warn(er.message);
//   }
//   return false;
// };

const readPackage = async (options: {
  redis: Redis;
  file: string;
  force?: boolean;
}) => {
  const { file, force = false, redis } = options;
  if (!force) {
    console.log(file);
    const cachedValue = await redis.get(`${READ_PACKAGE_PREFIX}${file}`);
    if (cachedValue) {
      return cachedValue;
    }
  }

  // Hardocs hidden folder
  const hardocsDir = path.join(file, '.hardocs');
  const hardocsPkg = path.join(hardocsDir, 'hardocs.json');

  if (fs.existsSync(hardocsDir) && fs.existsSync(hardocsPkg)) {
    const pkg = fs.readJsonSync(hardocsPkg);
    await redis.set(file, pkg, 'EX', 60 * 60);
    return pkg;
  }
};

const clearCachedValue = async ({
  file,
  redis
}: {
  file: string;
  redis: Redis;
}): Promise<boolean> => {
  await redis.del(`${READ_PACKAGE_PREFIX}${file}`);
  return true;
};

const isHardocsProject = async (
  file: string,
  redis: Redis
): Promise<boolean> => {
  try {
    const pkg = await readPackage({ file, redis });
    return !!pkg;
  } catch (er) {
    if (process.env.HARDOCS_DEV_MODE) {
      logs.Warn(`${er}
      ${logs.chalk.blue('This is not a HARDOCS projects')}
      `);
    }
    return false;
  }
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
  // isPackage,
  readPackage,
  clearCachedValue,
  isHardocsProject
};
