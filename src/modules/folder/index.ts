import * as fs from 'fs';
import * as path from 'path';
import { getHardocsDir } from './../../utils/constants';

const isPlatformWindows =
  process.platform.indexOf('win') === 0 || process.platform.includes('win');
const hiddenPrefix = '.';

/**
 *
 * @param src `from`. folder or file you whish to copy
 * @param dest `to`. destination where you want to copy files/folder to
 */
const copy = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  fs.readdirSync(src).forEach((element) => {
    if (fs.lstatSync(path.join(src, element)).isFile()) {
      fs.copyFileSync(path.join(src, element), path.join(dest, element));
    } else {
      copy(path.join(src, element), path.join(dest, element));
    }
  });
};

const isDirectory = (folder: string) => {
  folder = folder.replace(/\\/g, path.sep);
  try {
    return fs.existsSync(folder) && fs.statSync(folder).isDirectory();
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

const generateFolder = (folder: string) => {
  return {
    name: path.basename(folder),
    path: folder
  };
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
      // const windowsFile = file.replace(/\\/g, '\\\\');
      // console.log({ windowsFile });
      // result.windows = winattr.getSync(windowsFile).hidden;
    }

    return (
      (!isPlatformWindows && result.unix) ||
      (isPlatformWindows && result.windows)
    );
  } catch (er) {
    if (process.env.HARDOCS_DEV_MODE) {
      return console.log(er);
    }
  }
};

const readPackage = (docsPath: string) => {
  // Hardocs hidden folder
  const hardocsDir = getHardocsDir(docsPath);
  const hardocsPkg = path.join(hardocsDir, 'hardocs.json');

  try {
    if (isDirectory(hardocsDir)) {
      if (fs.existsSync(hardocsPkg)) {
        const jSON = fs.readFileSync(hardocsPkg, 'utf8');

        return jSON;
      }
      return 'Please provide a hardocs-json file';
    }
    return 'Please specify a valid hardocs directory';
  } catch (err) {
    console.error(err);
    return false;
  }
};

const isHardocsProject = (dir: string): boolean => {
  try {
    const pkg = readPackage(dir);
    return !!pkg;
  } catch (er) {
    if (process.env.HARDOCS_DEV_MODE) {
      console.log(`${er} 
      This is not a HARDOCS projects`);
    }
    return false;
  }
};

export default {
  isDirectory,
  generateFolder,
  list,
  isHidden,
  readPackage,
  isHardocsProject,
  copy
};
