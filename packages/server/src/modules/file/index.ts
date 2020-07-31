import * as matter from 'gray-matter';
import * as glob from 'glob';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { Options, ContextOnly } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';

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
  const allMarkdowns = glob.sync(`${directory}/**/*.*(md|mdx)`);
  return allMarkdowns;
};

const getEntryFilePath = async ({
  path: projectPath,
  context,
  fullPath
}: Partial<Options> & ContextOnly): Promise<string> => {
  if (!folder.isHardocsProject({ path: projectPath, context })) {
    throw new Error(logs.chalk.yellow('Not a valid hardocs project'));
  }

  const docsDir = await folder.getDocsFolder({
    path: projectPath,
    context,
    fullPath
  });
  const entryFileName = (
    await getHardocsJsonFile({ path: projectPath, context, fullPath })
  ).hardocsJson.entryFile;

  const entryFile = `${docsDir}/${entryFileName}`;
  console.log({ entryFile });
  return entryFile;
};

const getHardocsJsonFile = async ({
  path,
  context,
  fullPath = false
}: Partial<Options> & ContextOnly): Promise<{
  hardocsJson: HDS.IProject;
  currentDir: string;
}> => {
  let currentDir = cwd.get();
  if (fullPath) {
    if (path) {
      currentDir = path;
    }
  }

  const hardocsDir = getHardocsDir(currentDir);

  if (!folder.isHardocsProject({ path: currentDir, context })) {
    throw new Error(logs.chalk.red('Not a valid hardocs project'));
  }
  const hardocsFile = await fs.readFile(`${hardocsDir}/hardocs.json`, {
    encoding: 'utf8'
  });
  const hardocsJson = JSON.parse(hardocsFile);
  return { hardocsJson, currentDir };
};

const createMarkdownTemplate = async (
  entryPath: string,
  filename: string,
  path: string
) => {
  try {
    const data = await fs.readFile(entryPath, 'utf8');
    const newFile = await fs.writeFile(`${path}/${filename}`, data, {
      flag: 'w+'
    });
    return newFile;
  } catch (er) {
    throw new Error(logs.chalk.red('there was a problem: ', er));
  }
};

export default {
  extractMetaData,
  allMarkdownFiles,
  getEntryFilePath,
  getHardocsJsonFile,
  createMarkdownTemplate
};
