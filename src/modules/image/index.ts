import { Options } from '../../typings/globals';
import cwd from '../cwd';
import file from '../file';
import mime from 'mime-types';
import glob from 'glob';

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

export default { getImages, handleImagePaths, getImagesInHardocsProject };
