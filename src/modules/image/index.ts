import mime from 'mime-types';
import glob from 'glob';
import sharp from 'sharp';
import { v4 as UUIDv4 } from 'uuid';
import fs from 'fs';
import __ from 'lodash';

import cwd from '../cwd';
import file from '../file';
import folder from '../folder';
import { Options } from '../../typings/globals';

const downloadAndOptimizeImage = (base64: string, dir?: string) => {
  /**
   * If `dir` is not provided, the current working directory will
   * be used instead
   */
  dir = dir || cwd.get();

  const data = base64.replace(/^data:image\/(jpeg|png|jpg|gif);base64,/, '');
  const img = Buffer.from(data, 'base64');

  try {
    if (!folder.isDirectory({ path: dir })) {
      return {
        error: true,
        message: 'invalid directory specified'
      };
    }
    // .resize(300, 200)
    sharp(img)
      .jpeg({ quality: 50 })
      .toFile(`${dir}/${UUIDv4()}.jpg`, function (err) {
        if (err) console.error({ err });
      });
    return true;
  } catch (err) {
    return {
      error: true,
      message: 'There was an error processing image',
      info: err
    };
  }
};

const handleImagePaths = (markdown: string, host: URL) => {
  const regex = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/gi;
  const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/i;
  // const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)(?=\"|\))\)/i;

  /**
   *
   * @param {string} str
   * @param {string} val
   */
  const startsWith = (str: string, val: string) => {
    if (str[0] === val || str.charAt(0) === val) return true;
    return false;
  };
  const result = markdown.replace(regex, (v) => {
    const imgObject = v.match(regex2);
    let newUrl = '';
    if (
      !imgObject ||
      !imgObject.groups ||
      imgObject.length < 1 ||
      typeof imgObject === 'undefined'
    ) {
      return v;
    }

    if (
      imgObject.groups.filename.startsWith(`http://`) ||
      imgObject.groups.filename.startsWith(`www.`) ||
      imgObject.groups.filename.startsWith(`https://`)
    ) {
      newUrl = imgObject.groups.filename;
    } else {
      if (startsWith(imgObject.groups.filename, '/')) {
        newUrl = [host, ...imgObject.groups.filename].join('');
      } else {
        newUrl = [`${host}/`, ...imgObject.groups.filename].join('');
      }
    }
    const alt = imgObject.groups.alt;
    return `${alt}(${newUrl})`;
  });
  return result;
};

const getImages = (path?: string) => {
  if (path) {
    cwd.set(path);
  }
  path ||= cwd.get();

  const allFiles = glob.sync(`${path}/**/*`);

  const images = allFiles
    .filter((file) => {
      if (!path) return;
      const f = mime.lookup(file).toString().startsWith('image');
      return f;
    })
    .map((file) => {
      if (!path) return file;
      return file.split(path)[1];
    });
  return images;
};

const getImagesInHardocsProject = ({ path }: Options): string[] | string => {
  cwd.set(path);
  const hardocsJson = file.getHardocsJsonFile({ path });
  if (hardocsJson) {
    const assetsDir = hardocsJson.hardocsJson.assets;
    if (assetsDir) {
      return getImages(`${path}/${assetsDir}`);
    } else {
      return getImages(path);
    }
  } else {
    throw new Error(
      `${path} is Not a valid hardocs project -- getImagesInHardocsProject`
    );
  }
};

const toBase64 = (imagePath: string) => {
  if (!file.exists(imagePath)) {
    return 'The file you seek does not exists';
  }

  const data = fs.readFileSync(imagePath, 'base64');
  return data;
};

const imageCache = ({ path }: Options) => {
  const images = getImagesInHardocsProject({ path });

  if (!images) {
    return;
  }
  const hardocsJson = file.getHardocsJsonFile({ path });
  const assetsDir = hardocsJson.hardocsJson.assets;
  const imageCacheFile = `${path}/.hardocs/image-cache.json`;

  let prevCache: any[] = [];

  if (file.exists(imageCacheFile)) {
    prevCache = JSON.parse(fs.readFileSync(imageCacheFile, 'utf-8')); // TODO: Validate JSON keys
  }

  const response: any[] = [];

  if (Array.isArray(images)) {
    images.forEach((image) => {
      let fullPath = `${path}${image}`;

      if (assetsDir) {
        fullPath = `${path}/${assetsDir}${image}`;
      }

      const base64 = toBase64(fullPath);
      const data = {
        id: `${base64.length}-${base64.slice(0, 10)}-${base64.slice(
          base64.length - 10,
          base64.length
        )}`,
        path: `${assetsDir}${image}`,
        fullPath
      };

      response.push(data);
    });
    const test = [
      ...response,
      {
        id: 'alksdjf',
        path: 'jweiojasdflk',
        fullPath: 'divine'
      }
    ];
    console.log({
      match: __.isEqual(prevCache, response),
      filter: __.difference(test, prevCache),
      test,
      prevCache
    });
  }

  // fs.writeFileSync(imageCacheFile, JSON.stringify(response, null, 2));
};

export default {
  getImages,
  handleImagePaths,
  getImagesInHardocsProject,
  downloadAndOptimizeImage,
  toBase64,
  imageCache
};
