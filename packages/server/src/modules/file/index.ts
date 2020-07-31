import * as matter from 'gray-matter';
import * as glob from 'glob';
// import * as path from 'path';

import cwd from '../cwd/cwd';
// import folder from '../folder';
import { Context } from '../../typings/globals';

const extractData = ({ filePath }: HDS.IOpenFileOnQueryArguments) => {
  const { data, content } = matter(filePath);
  return { data, content };
};

/**
 *
 * @param filePath <Optional> Specify if you want to read from another directory
 */
const allMarkdownFiles = (filePath?: string) => {
  const directory = filePath || cwd.get();

  console.log(directory);
  const allMarkdowns = glob.sync(`${directory}/**/*.*(md|mdx)`);
  return allMarkdowns;
};

const getEntryFile = (projectPath: string, context: Context) => {
  console.log(projectPath, context);
  // if (!folder.isHardocsProject({ file: projectPath })) {
  // }
  // const entryFile = allMarkdownFiles().map((file) => path.join());
};

export default {
  extractData,
  allMarkdownFiles,
  getEntryFile
};
