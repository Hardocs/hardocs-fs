import mime from 'mime-types';
import glob from 'glob';
import { v4 as UUIDv4 } from 'uuid';
import fs from 'fs';
import __ from 'lodash';
import Jimp from 'jimp';

import cwd from '../cwd';
import file from '../file';
import folder from '../folder';
import { Options } from '../../typings/globals';
import { generateId } from './utils';

const regexp = /^data:image\/(jpeg|png|jpg|gif);base64,/;

const downloadAndOptimizeImage = (
  options: {
    id: string;
    base64: string;
  },
  dir?: string
) => {
  const base64 = options.base64;
  console.log({ options });
  /**
   * If `dir` is not provided, the current working directory will
   * be used instead
   */
  dir = dir || cwd.get();

  const buffer = base64.replace(regexp, '');

  const img = Buffer.from(buffer, 'base64');

  try {
    if (!folder.isDirectory({ path: dir })) {
      return {
        error: true,
        message: 'invalid directory specified'
      };
    }

    const filename = `${UUIDv4()}.jpg`;
    const path = `${dir}/${filename}`;

    const defaultWidth = 600;

    Jimp.read(img, (err, res) => {
      if (err) throw err;
      let _width = res.getWidth();

      if (_width > defaultWidth) {
        _width = defaultWidth;
      }
      res.resize(_width, Jimp.AUTO).quality(60).write(path);
    });

    return {
      id: options.id,
      fullPath: path,
      filename
    };
  } catch (err) {
    return {
      error: true,
      message: 'There was an error processing image',
      info: err
    };
  }
};

const processImage = (data: string) => {
  data = data.replace(regexp, '');

  const buffer = Buffer.from(data, 'base64');
  const maxWidth = 600;
  const maxHeight = 400;

  Jimp.read(buffer, (err, res) => {
    if (err) throw new Error(err.message);

    let _width = res.getWidth();
    let _height = res.getHeight();

    if (_width > maxWidth) {
      _width = maxWidth;
    }
    if (_height > maxHeight) {
      _height = maxHeight;
    }

    res.resize(_width, Jimp.AUTO).quality(50);

    data = res.bitmap.data.toString('base64');
    // res.resize(_width, Jimp.AUTO)
    // .quality(0).write('resided-2.jpg')
  });
  return data;
};

const imagesInHtml = (html: string) => {
  // const regex = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/gi;
  // const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/i;
  const regex = /<img .*? \/>/gi;
  const regex2 = /<img .*?src="(?<filename>.*?)".?alt="(?<alt>.*?)" \/>/i;
  // const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)(?=\"|\))\)/i;

  const result = html.replace(regex, (v) => {
    const imgObject = v.match(regex2);

    if (
      !imgObject ||
      !imgObject.groups ||
      imgObject.length < 1 ||
      typeof imgObject === 'undefined'
    ) {
      return v;
    }

    const _filename = imgObject.groups.filename;

    if (_filename.match(/^http/)) {
      return v;
    }

    const newImage = processImage(_filename);
    const alt = imgObject.groups?.alt;

    const response = `<img src="${newImage}" alt="${alt}" />`;
    return response;
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

const imageCache = (path: string, images: any) => {
  // const images = getImagesInHardocsProject({ path });
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
        fullPath = `${path}/${assetsDir}/${image.slice(0, 100)}`;
      }
      const base64 = image.replace(regexp, '');

      const data = {
        id: generateId(base64),
        path: `${assetsDir}${image}`,
        fullPath
      };

      response.push(data);
    });
  } else {
    let fullPath = `${path}${images}`;

    if (assetsDir) {
      fullPath = `${path}/${assetsDir}/${images.slice(0, 100)}`;
    }
    const base64 = images.replace(regexp, '');

    const data = {
      id: generateId(base64),
      path: `${assetsDir}${images}`,
      fullPath
    };

    response.push(data);
  }

  const difference = __.differenceBy(response, prevCache, 'id');

  const newCache: any = prevCache;

  if (difference) {
    difference.map((_image) => {
      if (!file.exists(_image.fullPath)) {
        const _path = assetsDir ? `${path}/${assetsDir}` : path;
        // Download The image since it doesn't exist.
        const opts = downloadAndOptimizeImage(
          {
            base64: _image.path.split(assetsDir)[1],
            id: _image.id
          },
          _path
        );

        newCache.push({
          id: opts.id,
          path: `${assetsDir}/${opts.filename}`,
          fullPath: opts.filename
        });
      }
    });
  }

  fs.writeFileSync(imageCacheFile, JSON.stringify(newCache, null, 2));
  return newCache;
};

export default {
  getImages,
  imagesInHtml,
  getImagesInHardocsProject,
  downloadAndOptimizeImage,
  toBase64,
  imageCache
};

// const handleImagePaths = (html: string, host: URL) => {
//   const regex = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/gi;
//   const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/i;
//   // const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)(?=\"|\))\)/i;

//   /**
//    *
//    * @param {string} str
//    * @param {string} val
//    */
//   const startsWith = (str: string, val: string) => {
//     if (str[0] === val || str.charAt(0) === val) return true;
//     return false;
//   };
//   const result = html.replace(regex, (v) => {
//     const imgObject = v.match(regex2);
//     let newUrl = '';
//     if (
//       !imgObject ||
//       !imgObject.groups ||
//       imgObject.length < 1 ||
//       typeof imgObject === 'undefined'
//     ) {
//       return v;
//     }

//     if (
//       imgObject.groups.filename.startsWith(`http://`) ||
//       imgObject.groups.filename.startsWith(`www.`) ||
//       imgObject.groups.filename.startsWith(`https://`)
//     ) {
//       newUrl = imgObject.groups.filename;
//     } else {
//       if (startsWith(imgObject.groups.filename, '/')) {
//         newUrl = [host, ...imgObject.groups.filename].join('');
//       } else {
//         newUrl = [`${host}/`, ...imgObject.groups.filename].join('');
//       }
//     }
//     const alt = imgObject.groups.alt;
//     return `${alt}(${newUrl})`;
//   });
//   return result;
// };
