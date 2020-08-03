import * as matter from 'gray-matter';
import * as glob from 'glob';
import * as fs from 'fs-extra';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { Options, ContextOnly, Path } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';

const extractFrontMatter = async ({
  filePath
}: HDS.IOpenFileOnQueryArguments) => {
  const readFile = await fs.readFile(filePath);
  const { data, content } = matter(readFile);
  return { data, content };
};

/**
 *
 * @param filePath <Optional> Specify if you want to read from another directory
 */
const allMarkdownFiles = (filePath?: string) => {
  if (!filePath) {
    filePath = cwd.get();
  }
  const allMarkdowns = glob.sync(`${filePath}/**/*.*(md|mdx)`);
  return allMarkdowns;
};

const getEntryFilePath = async ({
  path: projectPath,
  context,
  force
}: Partial<Options> & ContextOnly): Promise<string> => {
  if (!folder.isHardocsProject({ path: projectPath, context })) {
    throw new Error(logs.chalk.yellow('Not a valid hardocs project'));
  }

  const docsDir = await folder.getDocsFolder({
    path: projectPath,
    context,
    force
  });
  const entryFileName = (
    await getHardocsJsonFile({ path: projectPath, context, force })
  ).hardocsJson.entryFile;

  const entryFile = `${docsDir}/${entryFileName}`;
  return entryFile;
};

const getHardocsJsonFile = async ({
  path,
  context,
  force = false
}: Partial<Options> & ContextOnly): Promise<{
  hardocsJson: HDS.IProject;
  currentDir: string;
}> => {
  let currentDir = cwd.get();
  if (force) {
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

const extractEntryFileData = async ({ path, context, force }: Options) => {
  const entryFilePath = await getEntryFilePath({ path, context, force });

  const metadata = await extractFrontMatter({ filePath: entryFilePath });
  return metadata;
};

const extractAllFileData = async ({ path }: Path) => {
  const allMarkdownFilesPath = allMarkdownFiles(path);
  try {
    const allData = allMarkdownFilesPath.map(async (f) => {
      const d = await extractFrontMatter({ filePath: f });
      console.log(d);
      return d;
    });

    console.log({ allData });
  } catch (er) {
    console.log(er);
  }
};
export default {
  extractFrontMatter,
  allMarkdownFiles,
  getEntryFilePath,
  getHardocsJsonFile,
  createMarkdownTemplate,
  extractEntryFileData,
  extractAllFileData
};
