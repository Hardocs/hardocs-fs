import cwd from '../cwd';
import mime from 'mime-types';
import * as fs from 'fs-extra';

const getImages = (path?: string) => {
  if (path) {
    cwd.set(path);
  }
  path ||= cwd.get();

  const allFiles = fs.readdirSync(path);

  const images = allFiles.filter((file) => {
    const f = mime.lookup(file).toString().includes('image');
    return f && file;
  });
  return images;
};

export default { getImages };
