import file from '../';
import path from 'path';

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

  it('returns an array of strings of paths to markdown files', () => {
    const paths = file.allMarkdownFilesPath(__dirname + '../folder');
    console.log({ paths });
  });
});
