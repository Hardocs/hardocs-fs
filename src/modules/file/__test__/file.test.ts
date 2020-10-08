import file from '../';
import path from 'path';
import fs from 'fs-extra';

const emptyDir = path.join(__dirname, 'empty');
const markdownFile = path.join(__dirname, 'test-file.md');
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
  const filePath = path.join(__dirname, 'test-file.md');
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
});
