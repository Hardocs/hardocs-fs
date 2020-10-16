import glob from 'glob';
import * as fs from 'fs';

import cwd from '../cwd';
import folder from '../folder';
import { Options, Path } from '../../typings/globals';
import { getHardocsDir } from './../../utils/constants';
import showdown from 'showdown';
// import jsdom from 'jsdom';
// import image from '../image'; // FIXME: Handle images

const converter = new showdown.Converter({ metadata: true });
// const dom = new jsdom.JSDOM();

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

const writeToFile = (input: HDS.IFileInput): boolean | HDS.IError => {
  const { path, title, description, content, fileName } = input;
  if (!input) {
    throw new Error('Input all fields');
  }
  const yml = `---
title: ${title}
description: ${description}
---
`;

  //   const mdContent = converter.makeMarkdown(content, dom.window.document);
  //   const markdown = `${yml}
  // ${mdContent}
  //   `;

  // const mdContent = converter.makeMarkdown(content, dom.window.document);
  const markdown = `${yml}
${content}
  `;

  const newPath = `${path}/${fileName}`;
  try {
    fs.writeFileSync(newPath, markdown, { encoding: 'utf8' });

    return true;
  } catch (er) {
    return {
      error: true,
      message: er.message
    };
  }
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
  if (!force) {
    projectPath = `${cwd.get()}/${projectPath}`;
  }

  if (!folder.isHardocsProject({ path: projectPath, force })) {
    throw new Error('Not a valid hardocs project');
  }

  const docsDir = await folder.getDocsFolder({
    path: projectPath,
    force
  });
  const entryFileName = getHardocsJsonFile({ path: projectPath, force })
    .hardocsJson.entryFile;

  const entryFile = `${docsDir}/${entryFileName}`;
  return entryFile;
};

const getHardocsJsonFile = ({
  path,
  force = false
}: Partial<Options>): {
  hardocsJson: HDS.IProject;
  currentDir: string;
} => {
  if (force && !path) {
    throw new Error('Please specify path when using `force: true` option..');
  }
  if (!path) {
    path = cwd.get();
  }

  const hardocsDir = getHardocsDir(path);

  if (!folder.isHardocsProject({ path, force })) {
    throw new Error('Not a valid hardocs project');
  }
  const hardocsFile: string = fs.readFileSync(
    `${hardocsDir}/hardocs.json`,
    'utf-8'
  );
  const hardocsJson = JSON.parse(hardocsFile);
  return { hardocsJson, currentDir: path };
};

const createMarkdownTemplate = async (filename: string, path: string) => {
  try {
    // const data = fs.readFileSync(entryPath, 'utf-8');

    const data = `
---
title: Example
description: This is a test document
---

# Example Doc

Keep doing what you're doing
    `;

    const newFile = fs.writeFileSync(`${path}/${filename}`, data, {
      flag: 'w+'
    });
    return newFile;
  } catch (er) {
    throw new Error('there was a problem: ' + er);
  }
};

const openEntryFile = async ({ path, force }: Options) => {
  if (!force) {
    path = `${cwd.get()}/${path}`;
  }

  const metadata = openFile({ path, force: false });
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
}: HDS.IDeleteFileOnMutationArguments): boolean | HDS.IError => {
  if (folder.isDirectory({ path: filePath })) {
    return {
      error: true,
      message: 'File path must point to a valid file and not a directory'
    };
  }

  if (!exists(filePath)) {
    return {
      error: true,
      message: "File doesn't exist"
    };
  }
  fs.stat(filePath, (err, stat) => {
    if (err) {
      return {
        error: true,
        message: err.message
      };
    }

    // Already handled this in the upper scope, however, we want to avoid errors as much as possible
    if (stat.isDirectory()) {
      return {
        error: true,
        message: "Method doesn't support deleting of directories."
      };
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        return {
          error: true,
          message: err.message
        };
      }
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
