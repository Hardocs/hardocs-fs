import file from '../';
import path from 'path';
import fs from 'fs';
import json from './hardocs.json';

const emptyDir = path.join(__dirname, 'empty');
const htmlFile = path.join(__dirname, 'divine-quote.html');
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
  const filePath = path.join(__dirname, 'divine-quote.html');
  it('exists', () => {
    expect(file.exists(filePath)).toBeTruthy();
  });

  it('opens a file and return an object', () => {
    const openFile = file.openFile({ path: filePath });

    const openFileKeys = {
      title: '',
      content: '',
      fileName: '',
      path: ''
    };

    const sortedFileKeys = Object.keys(openFile).sort();
    const sortedFileTest = Object.keys(openFileKeys).sort();
    expect(sortedFileKeys).toEqual(sortedFileTest);
  });

  it('returns an array of strings of paths to html files in this directory', () => {
    const paths = file.allHtmlFilesPath(__dirname);
    expect(paths).toEqual([htmlFile]);
  });
  it('returns an empty array for folders without html files', () => {
    const paths = file.allHtmlFilesPath(emptyDir);
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

  it('saves a html file', () => {
    const text = `
<blockquote>Train your Mind, Body and Soul to become Exceptional.</blockquote> 
    
<i>_Divine Nature_</i>

<img src="${imgData}" alt="Large" />
    `;

    const data = {
      title: 'The quote',
      fileName: 'divine-quote.html',
      path: __dirname,
      content: text
    };
    const response = file.writeToFile(data, true);

    expect(response).toBeTruthy();
  });

  it('deletes any file', () => {
    const filePath = `${__dirname}/test.txt`;
    fs.writeFileSync(filePath, 'Hello world');

    const response = file.delete({ filePath });
    expect(response).toBeTruthy();
  });

  it('returns an error for invalid path', () => {
    const filePath = `${__dirname}/test`;

    const response = file.delete({ filePath });
    expect(response).toEqual(
      expect.objectContaining({
        error: true,
        message: "File doesn't exist"
      })
    );
  });

  it('returns an error when trying to delete a directory', () => {
    const filePath = `${__dirname}`;

    const response = file.delete({ filePath });
    expect(response).toEqual(
      expect.objectContaining({
        error: true,
        message: 'File path must point to a valid file and not a directory'
      })
    );
  });
});

const imgData =
  'data:image/jpeg;base64,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';
