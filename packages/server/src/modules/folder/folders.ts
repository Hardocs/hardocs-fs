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

const generateFolder = (file: string, _context: any) => {
  return {
    name: path.basename(file),
    path: file
  };
};

const getCurrent = (_file: any, context: any) => {
  const baseDir = cwd.get();
  return generateFolder(baseDir, context);
};

export default {
  isDirectory,
  generateFolder,
  getCurrent
};
