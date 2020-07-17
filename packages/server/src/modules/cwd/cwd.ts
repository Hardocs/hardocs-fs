import * as fs from 'fs';
import * as path from 'path';

let cwd: string = process.cwd();

const normalize = (value: string) => {
  if (value.length === 1) return value;
  const lastChar = value.charAt(value.length - 1);
  if (lastChar === path.sep) {
    value = value.substr(0, value.length - 1);
  }
  return value;
};

export default {
  get: () => cwd,
  set: (value: string) => {
    const newDir = normalize(value);
    console.log(newDir);
    if (!fs.existsSync(value)) return;
    cwd = newDir;
    try {
      process.chdir(newDir);
    } catch (err) {
      console.log(err);
    }
  }
};
