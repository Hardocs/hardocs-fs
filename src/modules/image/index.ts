import cwd from '../cwd';
import mime from 'mime-types';
import * as fs from 'fs-extra';

const getImages = (path: string) => {
  path ||= cwd.get();

  const allFiles = fs.readdirSync(path);

  const images = allFiles.filter(
    (file) => mime.lookup(file).toString().includes('images') && file
  );
  console.log({ images });
  return images;
};

export default { getImages };
