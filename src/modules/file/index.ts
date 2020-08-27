import matter from 'gray-matter';
import glob from 'glob';
import fs from 'fs-extra';
import yaml from 'yaml';

import cwd from '../cwd/cwd';
import folder from '../folder';
import logs from '../../utils/logs';
import { Options, ContextOnly, Path } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';
import showdown from 'showdown';
const converter = new showdown.Converter();

const openFile = ({
  filePath,
  isFull = false
}: HDS.IOpenFileOnMutationArguments & {
  isFull: boolean;
}) => {
  try {
    if (!filePath) {
      filePath = cwd.get();
    }
    const readFile = fs.readFileSync(filePath);
    const { data, content } = matter(readFile);
    const c = converter.makeHtml(content);

    return {
      title: data.title,
      description: data.description,
      content: c,
      fileName: getFileName({ path: filePath }),
      path: isFull ? filePath : `${cwd.get()}/${filePath}`
    };
  } catch (er) {
    throw new Error(logs.chalk.red(er.message));
  }
};

const writeToFile = ({
  path,
  title,
  description,
  content,
  fileName
}: HDS.IFileInput) => {
  const yml = yaml.stringify(`
---
title: ${title}
description: ${description},
---
  `);

  fs.writeFileSync(path + `test.yaml`, yml);
  const mdContent = converter.makeMarkdown(content);
  const markdown = `
${yaml}
${mdContent}
  `;
  fs.writeFileSync(path + fileName, markdown);
  const result = {
    path,
    title,
    description,
    content: markdown,
    fileName
  };
  return result;
};

/**
 *
 * @param filePath <Optional> Specify if you want to read from another directory
 */
const allMarkdownFilesPath = (filePath?: string) => {
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
  const hardocsFile: string = await fs.readFile(`${hardocsDir}/hardocs.json`, {
    encoding: 'utf8'
  });
  const hardocsJson = await JSON.parse(hardocsFile);
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

const openEntryFile = async ({ path, context, force }: Options) => {
  const entryFilePath = await getEntryFilePath({ path, context, force });

  const metadata = openFile({ filePath: entryFilePath, isFull: false });
  return metadata;
};

const extractAllFileData = async ({ path }: Path) => {
  const allMarkdownFilesPathPath = allMarkdownFilesPath(path);
  try {
    return allMarkdownFilesPathPath.map((f) => {
      const d = openFile({ filePath: f, isFull: false });
      // const d = await openFile({ filePath: f });

      const data = {
        // title: d.title,
        // description: d.description,
        // fileName: getFileName({ path: f }),
        // fullPath: `${cwd.get()}/${d.path}`,
        ...d,
        content: ''
      };
      return data;
    });
  } catch (er) {
    throw new Error(logs.chalk.red('Error occurred :('));
  }
};

const getFileName = ({ path }: Path) => {
  const fullPath = path.split(/\//gis);
  const lastIndex = fullPath[fullPath.length - 1];
  return lastIndex.toString().includes(`.md`) && lastIndex;
};
export default {
  openFile,
  allMarkdownFilesPath,
  getEntryFilePath,
  getHardocsJsonFile,
  createMarkdownTemplate,
  openEntryFile,
  extractAllFileData,
  getFileName,
  writeToFile
};
