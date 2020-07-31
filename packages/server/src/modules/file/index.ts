import * as matter from 'gray-matter';
import * as glob from 'glob';
import * as path from 'path';

import cwd from '../cwd/cwd';
import folder from '../folder';
import { Options } from './../../typings/globals';

const extractMetaData = ({ filePath }: HDS.IOpenFileOnQueryArguments) => {
  const { data, content } = matter(filePath);
  console.log({ data, content });
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

const getEntryFile = ({ path: projectPath, context }: Options) => {
  console.log(projectPath, context);
  if (!folder.isHardocsProject({ path: projectPath, context })) {
  }

  const entryFile = allMarkdownFiles().filter((file) =>
    file.split('/')[file.length - 1].includes('index.md')
  );
  console.log(entryFile);
};

export default {
  extractMetaData,
  allMarkdownFiles,
  getEntryFile
};
