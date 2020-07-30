import { Redis } from 'ioredis';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as winattr from 'winattr';

import { FolderProjectOptions, GeneratedFolder } from '../../typings/globals';
import logs from '../../utils/logs';
import cwd from '../cwd/cwd';
import { getHardocsDir } from './../../utils/constants';
import { READ_PACKAGE_PREFIX } from './constants';

const isPlatformWindows =
  process.platform.indexOf('win') === 0 || process.platform.includes('win');
const hiddenPrefix = '.';

const isDirectory = ({ path: file }: FolderProjectOptions) => {
  file = file.replace(/\\/g, path.sep);
  try {
    return fs.existsSync(file) && fs.statSync(file).isDirectory();
  } catch (err) {
    logs.Warn(err.message);
  }
  return false;
};

const generateFolder = ({
  path: file
}: FolderProjectOptions): GeneratedFolder => {
  return {
    name: path.basename(file),
    path: file
  };
};

const getCurrent = () => {
  const baseDir = cwd.get();
  return generateFolder({ path: baseDir });
};

const open = async ({ path: file }: FolderProjectOptions) => {
  await cwd.set(file);
  return generateFolder({ path: cwd.get() });
};

const openParent = ({ path: file }: FolderProjectOptions) => {
  const newPath = path.dirname(file);
  cwd.set(newPath);
  return generateFolder({ path: cwd.get() });
};

const createFolder = ({ name }: { name: string }) => {
  if (isDirectory({ path: name })) {
    logs.Warn(`Folder already exist.`);
    return false;
  }

  const folder = path.join(cwd.get(), name);
  fs.ensureDirSync(folder);
  return generateFolder({ path: folder });
};

const list = async (base: string) => {
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
        hidden: isHidden(folderPath)
      };
    })
    .filter((file) => isDirectory({ path: file.path }));
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

const readPackage = async (options: {
  redis: Redis;
  file: string;
  force?: boolean;
}) => {
  const { file, force = false, redis } = options;
  if (!force) {
    const cachedValue = await redis.get(`${READ_PACKAGE_PREFIX}${file}`);
    if (cachedValue) {
      return cachedValue;
    }
  }

  // Hardocs hidden folder
  const hardocsDir = getHardocsDir(file);
  const hardocsPkg = path.join(hardocsDir, 'hardocs.json');

  if (isDirectory({ path: hardocsDir })) {
    if (fs.existsSync(hardocsPkg)) {
      const pkg = fs.readJsonSync(hardocsPkg);
      await redis.set(file, pkg, 'EX', 60 * 60);
      return pkg;
    } else {
      logs.Warn('Not a hardocs directory');
      return false;
    }
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

const deleteFolder = async ({ path }: { path: string }): Promise<boolean> => {
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
  // isPackage,
  readPackage,
  clearCachedValue,
  isHardocsProject,
  deleteFolder
};
