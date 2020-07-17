import * as path from 'path';
import * as fs from 'fs-extra';
import logs from '../../utils/logs';
import cwd from '../cwd/cwd';

const isDirectory = (file: string) => {
  file = file.replace(/\\/g, path.sep);
  try {
    return fs.statSync(file).isDirectory();
  } catch (err) {
    logs.Warn(err.message);
  }
  return false;
};

const generateFolder = (file: string) => {
  return {
    name: path.basename(file),
    path: file
  };
};

const getCurrent = (_file: any) => {
  const baseDir = cwd.get();
  return generateFolder(baseDir);
};

const open = (file: string) => {
  cwd.set(file);
  return generateFolder(cwd.get());
};

function openParent(file: string) {
  const newPath = path.dirname(file);
  cwd.set(newPath);
  return generateFolder(cwd.get());
}

export default {
  isDirectory,
  generateFolder,
  getCurrent,
  open,
  openParent
};
