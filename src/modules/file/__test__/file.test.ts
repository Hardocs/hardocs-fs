import file from '../';
import path from 'path';

describe('Test for file operations: ', () => {
  const filePath = path.join(__dirname, 'test-file.md');
  it('exists', () => {
    console.log(filePath);
    expect(file.exists(filePath)).toBeTruthy();
  });
});
