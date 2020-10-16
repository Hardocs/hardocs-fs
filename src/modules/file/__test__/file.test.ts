import file from '../';
import path from 'path';
import fs from 'fs';
import json from './hardocs.json';

const emptyDir = path.join(__dirname, 'empty');
const markdownFile = path.join(__dirname, 'divine-quote.md');
beforeAll(() => {
  /**
   * Create an empty directory to use for testing
   */
  fs.mkdirSync(emptyDir);
});
afterAll(() => {
  /**
   * Deletes the empty directory created
   */
  fs.rmdirSync(emptyDir);
});
describe('Test for file operations: ', () => {
  const filePath = path.join(__dirname, 'divine-quote.md');
  it('exists', () => {
    expect(file.exists(filePath)).toBeTruthy();
  });

  it('opens a file and return an object', () => {
    const openFile = file.openFile({ path: filePath });

    const openFileKeys = {
      description: '',
      title: '',
      content: '',
      fileName: '',
      path: ''
    };

    const sortedFileKeys = Object.keys(openFile).sort();
    const sortedFileTest = Object.keys(openFileKeys).sort();
    expect(sortedFileKeys).toEqual(sortedFileTest);
  });

  it('returns an array of strings of paths to markdown files in this directory', () => {
    const paths = file.allMarkdownFilesPath(__dirname);
    expect(paths).toEqual([markdownFile]);
  });
  it('returns an empty array for folders without markdown files', () => {
    const paths = file.allMarkdownFilesPath(emptyDir);
    expect(paths).toEqual([]);
  });

  it('returns hardocs json file', () => {
    const { hardocsJson } = file.getHardocsJsonFile({
      path: '/home/divine/Documents/projects/hardocs/hardocs-fs/test-project',
      force: true
    });

    hardocsJson.id = '1';
    json.id = '1';
    expect(hardocsJson).toEqual(expect.objectContaining(json));
  });

  it('saves a markdown file', () => {
    const text = `
> Train your Mind, Body and Soul to become Exceptional.


_Divine Nature_
    `;

    const data = {
      title: 'The quote',
      description: 'Quote by Divine',
      fileName: 'divine-quote.md',
      path: __dirname,
      content: text
    };
    const response = file.writeToFile(data);

    expect(response).toEqual(expect.objectContaining(data));
  });

  it('deletes any file', () => {
    const filePath = `${__dirname}/test.txt`;
    fs.writeFileSync(filePath, 'Hello world');

    const response = file.delete({ filePath });
    expect(response).toBeTruthy();
  });
});
