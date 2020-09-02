import matter from 'gray-matter';
import glob from 'glob';
import fs from 'fs-extra';
// import yaml from 'yaml';

import cwd from '../cwd';
import folder from '../folder';
import { Options, ContextOnly, Path } from './../../typings/globals';
import { getHardocsDir } from './../../utils/constants';
import showdown from 'showdown';
import jsdom from 'jsdom';
const converter = new showdown.Converter();
const dom = new jsdom.JSDOM();

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
    throw new Error(er.message);
  }
};

const writeToFile = (input: HDS.IFileInput) => {
  const { path, title, description, content, fileName } = input;
  if (!input) {
    throw new Error('Input all fields');
  }
  const yml = `---
title: ${title}
description: ${description}
---
`;

  const mdContent = converter.makeMarkdown(content, dom.window.document);
  const markdown = `${yml}
${mdContent}
  `;
  fs.writeFileSync(path + fileName, markdown, { encoding: 'utf8' });
  const result = {
    path,
    title,
    description,
    content,
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
    throw new Error('Not a valid hardocs project');
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
    throw new Error('Not a valid hardocs project');
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
    throw new Error('there was a problem: ' + er);
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
        ...d
        // content: '' TODO: return only entry file contents
      };
      return data;
    });
  } catch (er) {
    throw new Error('Error occurred :(');
  }
};

const getFileName = ({ path }: Path) => {
  const fullPath = path.split(/\//gis);
  const lastIndex = fullPath[fullPath.length - 1];
  return lastIndex.toString().includes(`.md`) && lastIndex;
};

const exists = (path: string): boolean => {
  return fs.existsSync(path);
};

const deleteFile = ({
  filePath
}: HDS.IDeleteFileOnMutationArguments): boolean => {
  if (folder.isDirectory({ path: filePath })) {
    throw new Error('File path must point to a valid file and not a directory');
  }

  if (!exists(filePath)) {
    throw new Error('File does not exist');
  }
  fs.stat(filePath, (err, stat) => {
    if (err) {
      console.log(err);
    }
    if (stat.isDirectory()) {
      console.log(`${filePath} is a Directory`);
      return false;
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log(`${filePath} deleted successfully`);
      return true;
    });
    return true;
  });

  return true;
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
  writeToFile,
  delete: deleteFile,
  exists
};
