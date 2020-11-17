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
<blockquote>Train your Mind, Body and Soul to become Exceptional.</blockquote> 
    
<i>_Divine Nature_</i>

<img src="${imgData}" alt="Large" />
    `;

    const data = {
      title: 'The quote',
      fileName: 'divine-quote.md',
      path: __dirname,
      content: text
    };
    const response = file.writeToFile(data, false);

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
  'data:image/jpeg;base64,/9j/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCADIASwDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwT/xAApEAEBAAICAQQCAQQDAQAAAAAAAQIRITFBElFhgQNxIpGhsfATMvFC/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABsRAQEBAAIDAAAAAAAAAAAAAAABESFBAhIx/9oADAMBAAIRAxEAPwAA7uQqKiAAigAAqIAAACBuM5ZScMXKzvj2Fxu56nTld288EuM3am9q1Jiyf2JxTfDcm0VO2oYzXbSM2in6EZPmKl6NwFYyuqu75jOVCL6kuXyzaitY1FZnbW0C1NlZ3uCrUAUABsB0RQEBQEABFAQALYIrGecnGtly5crlP/mfYsi785cT/LOV3eUtuV3b+mbfE6V0kVqWa1GJG8YhW8Y1JrvlMY3MeNoxad8aUidfsZWFvlnaUMW3hlbU9WuhpbeGbVZosEEFa2epkDGrSdMLsGjbOxBrYkNA6KitoACKAAoIgBsQyuo5XLV15X8mXOnK3nY3I1llrHU89sxntq8ceBpLfCSHbUgq4xvGTTMbk9kYqtTLjVTXHP8AQ1wMn2nqZyyk2x6relxZHW33Yuc92fT709MFyN7Nscf7T+oY0Jv2pv3AsRdpRUBBVEVAnaoA1tAB2AaZFRRAARQEBjO6b25/koRyyu6mvJTY6HVXfqZagpMb7NzH3Zkb6nAzVkm25wxLvV+Gt6RinTncreMTLLd1Ok6irIak75TaWorWLtNmremp+O0XhnZt0/4ql/GibGNnqW4JcaLwqbTmJtVxoTZtBoTYIEZtWUVuLwyqI7ANMioogqCIoAhXPN0ZymxY4WJp0s4TQ3rMjWlka0hqSF71ftqJlN6surBlzluOXpXLK3hcpPyTc4s8MS7Vpek2m9U1tVWTbrj+Lq5OeF9N23fy0Zu9OupPZNxyue09SYz6u1sZ3HLabpi+rrbGbYxtNmNYtZq7RViAg0ptABrFmN4xKVqLogjDqA0gqKIAqIACCWL9njsHOypp0rCNak3fpqSRPom/9oLv7WXbOzfpm8ed9wRM5ZfVHOzfM7dpcc9av0xlhq3VVqVz7+TVi2JpWjfyNTHlq60JrmNa21MJzv23oNYGpJvlfSGsa2ab9Ol0JrlYmnT0npF1zRuxNcDWsC2NSC6kjcSRqRKzaKuk0iOgDSHyuwEAVENm4G/gReyTUTk1sEvP6ZrVvhn0/KLCz91Pv+6615Sf3FT/AHtJfFrWmbJ5ii3GZXbNmU87JbjVtulVP5Wcppd8EqC9FPK485QRvHDXPksmHPd8Ru8R58rzRJylvLphzHF6PxT+K1ry4hceCRu9MsueppLFtZVqM5RJGtHuNa55T+OzHqNZf9aYz+MF6WRrSRpGURo1AUBpQ+xRD7PsVET7WbD7EPs+z7XXyCcaTWrdNa+Us+UGbuzwxzG9s27u9Cw/aWfK9grnrnssrdnXZxFXWZKs4U0CVcP+0SmPYnTvlHK4b37uveqa5RiXHn9Ft5jvhNY6X0xV0vlqXpJFvJ0iM2M1rLJiq3GavipTxoaTPjFcOozn4jXUDpY1EixEDj2XyavsiADbQqKIeOAVETheAEOF4ABm6v8A60cojFx3/wCs3Gzw6XL4Z/oNbWJ37DVnlBUp2efB1f2oVdbPhZwDFML/ACXJjyL9j0Tjj+ixJZljysmkclBm5aBWMsltYqtSJQQaPJ5E74FSc5b9mySRqRC1I1CRUZQ1VRQEVpoNCiAAigIKIogW6gIjnTHt09MNSdC6zYzpusosZTKbjWuCKqY3c15a64rNxs5hL6p8qiZXlJjtv/j454NXHiC6Y8cVqZpxYagyu9+UNJvQFRLUtt6GsW2Iki9Cl4MYsm++10gSNRJOF0jIooiKCjIitNgAigAoCIKiiAAis21T5QYlVL2v+UaJF9PJNTst3wIxlbePH+V9G+uKtWNCTKzjKNcXo74qXD2qIXH2ZuPZblGbn8KslLKi25eyTd8DRpejnfZJ5QTm9Q1pq8prYJGvSsx01pE1F6NAic3pTS6URQBzVBptQAURRBUERQBFEUAS08IFnB7kvhbOEGSKaUFlkRREt2sqAJlWZHTUNC6x9muNt+n3PSGubWuGtSM5X2D6nAjcgtJ7rTQjKfsvKiqnMVAFRUUYAadFARBQEAAUBEABEoCKulAQ0AIAAAAoAgAAzlAFhPC+aAAAAAIAqgAP/9k=';
