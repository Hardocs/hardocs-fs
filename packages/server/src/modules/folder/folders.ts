import * as path from 'path';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';

const isDirectory = (file: string) => {
  file = file.replace(/\\/g, path.sep);
  try {
    return fs.statSync(file).isDirectory();
  } catch (err) {
    console.warn(chalk.yellow(err.message));
  }
  return false;
};

export default {
  isDirectory
};
