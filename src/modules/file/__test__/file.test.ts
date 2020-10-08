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

    console.log({ sortedFileKeys, sortedFileTest });
    expect(sortedFileKeys).toEqual(sortedFileTest);
  });
});
