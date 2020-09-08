import { Context } from '../../typings/globals';
import cwd from '../cwd';
import mime from 'mime-types';
import * as fs from 'fs-extra';

// FIXME: Omit images with URL type of src
const handleImagePaths = (markdown: string, context: Context) => {
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
    const host = context.url;
    if (
      !imgObject ||
      !imgObject.groups ||
      imgObject.length < 1 ||
      typeof imgObject === 'undefined'
    ) {
      return v;
    }
    if (startsWith(imgObject.groups.filename, '/')) {
      newUrl = [host, ...imgObject.groups.filename].join('');
    } else {
      newUrl = [`${host}/`, ...imgObject.groups.filename].join('');
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

  const allFiles = fs.readdirSync(path);

  const images = allFiles.filter((file) => {
    const f = mime.lookup(file).toString().includes('image');
    return f && file;
  });
  return images;
};

export default { getImages, handleImagePaths };
