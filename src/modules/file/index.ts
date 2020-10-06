import glob from 'glob';
import fs from 'fs-extra';

import cwd from '../cwd';
import folder from '../folder';
import { Options, Path } from '../../typings/globals';
import { getHardocsDir } from './../../utils/constants';
import showdown from 'showdown';
import jsdom from 'jsdom';
// import image from '../image'; // FIXME: Handle images

const converter = new showdown.Converter({ metadata: true });
const dom = new jsdom.JSDOM();

const openFile = ({ path: filePath, force = false }: Options) => {
  try {
    if (!filePath) {
      filePath = cwd.get();
    }
    const readFile = fs.readFileSync(filePath);
    const content = converter.makeHtml(String(readFile));
    const data: any = converter.getMetadata();
    // const parsedContent = image.handleImagePaths(content, context);
    const c = converter.makeHtml(content);

    return {
      title: data.title,
      description: data.description,
      content: c,
      fileName: getFileName({ path: filePath }),
      path: force ? filePath : `${cwd.get()}/${filePath}`
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
  
  force
}: Options): Promise<string> => {
  if (!folder.isHardocsProject({ path: projectPath })) {
    throw new Error('Not a valid hardocs project');
  }

  const docsDir = await folder.getDocsFolder({
    path: projectPath,
    force
  });
  const entryFileName = (
    await getHardocsJsonFile({ path: projectPath, force })
  ).hardocsJson.entryFile;

  const entryFile = `${docsDir}/${entryFileName}`;
  return entryFile;
};

const getHardocsJsonFile = async ({
  path,
  force = false
}: Options): Promise<{
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

  if (!folder.isHardocsProject({ path: currentDir }) || !hardocsDir) {
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

const openEntryFile = async ({ path, force }: Options) => {
  const entryFilePath = await getEntryFilePath({ path, force });

  const metadata = openFile({ path: entryFilePath, force: false });
  return metadata;
};

const extractAllFileData = async ({ path }: Options) => {
  const allMarkdownFilesPathPath = allMarkdownFilesPath(path);
  try {
    return allMarkdownFilesPathPath.map((f) => {
      const d = openFile({ path: f, force: false });
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
