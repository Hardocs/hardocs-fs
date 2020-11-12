import Turndown from 'turndown';
import fs from 'fs';

const turndown = new Turndown();

const data =
  'data:image/jpeg;base64,/9j/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCADIASwDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwT/xAApEAEBAAICAQQCAQQDAQAAAAAAAQIRITFBElFhgQNxIpGhsfATMvFC/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABsRAQEBAAIDAAAAAAAAAAAAAAABESFBAhIx/9oADAMBAAIRAxEAPwAA7uQqKiAAigAAqIAAACBuM5ZScMXKzvj2Fxu56nTld288EuM3am9q1Jiyf2JxTfDcm0VO2oYzXbSM2in6EZPmKl6NwFYyuqu75jOVCL6kuXyzaitY1FZnbW0C1NlZ3uCrUAUABsB0RQEBQEABFAQALYIrGecnGtly5crlP/mfYsi785cT/LOV3eUtuV3b+mbfE6V0kVqWa1GJG8YhW8Y1JrvlMY3MeNoxad8aUidfsZWFvlnaUMW3hlbU9WuhpbeGbVZosEEFa2epkDGrSdMLsGjbOxBrYkNA6KitoACKAAoIgBsQyuo5XLV15X8mXOnK3nY3I1llrHU89sxntq8ceBpLfCSHbUgq4xvGTTMbk9kYqtTLjVTXHP8AQ1wMn2nqZyyk2x6relxZHW33Yuc92fT709MFyN7Nscf7T+oY0Jv2pv3AsRdpRUBBVEVAnaoA1tAB2AaZFRRAARQEBjO6b25/koRyyu6mvJTY6HVXfqZagpMb7NzH3Zkb6nAzVkm25wxLvV+Gt6RinTncreMTLLd1Ok6irIak75TaWorWLtNmremp+O0XhnZt0/4ql/GibGNnqW4JcaLwqbTmJtVxoTZtBoTYIEZtWUVuLwyqI7ANMioogqCIoAhXPN0ZymxY4WJp0s4TQ3rMjWlka0hqSF71ftqJlN6surBlzluOXpXLK3hcpPyTc4s8MS7Vpek2m9U1tVWTbrj+Lq5OeF9N23fy0Zu9OupPZNxyue09SYz6u1sZ3HLabpi+rrbGbYxtNmNYtZq7RViAg0ptABrFmN4xKVqLogjDqA0gqKIAqIACCWL9njsHOypp0rCNak3fpqSRPom/9oLv7WXbOzfpm8ed9wRM5ZfVHOzfM7dpcc9av0xlhq3VVqVz7+TVi2JpWjfyNTHlq60JrmNa21MJzv23oNYGpJvlfSGsa2ab9Ol0JrlYmnT0npF1zRuxNcDWsC2NSC6kjcSRqRKzaKuk0iOgDSHyuwEAVENm4G/gReyTUTk1sEvP6ZrVvhn0/KLCz91Pv+6615Sf3FT/AHtJfFrWmbJ5ii3GZXbNmU87JbjVtulVP5Wcppd8EqC9FPK485QRvHDXPksmHPd8Ru8R58rzRJylvLphzHF6PxT+K1ry4hceCRu9MsueppLFtZVqM5RJGtHuNa55T+OzHqNZf9aYz+MF6WRrSRpGURo1AUBpQ+xRD7PsVET7WbD7EPs+z7XXyCcaTWrdNa+Us+UGbuzwxzG9s27u9Cw/aWfK9grnrnssrdnXZxFXWZKs4U0CVcP+0SmPYnTvlHK4b37uveqa5RiXHn9Ft5jvhNY6X0xV0vlqXpJFvJ0iM2M1rLJiq3GavipTxoaTPjFcOozn4jXUDpY1EixEDj2XyavsiADbQqKIeOAVETheAEOF4ABm6v8A60cojFx3/wCs3Gzw6XL4Z/oNbWJ37DVnlBUp2efB1f2oVdbPhZwDFML/ACXJjyL9j0Tjj+ixJZljysmkclBm5aBWMsltYqtSJQQaPJ5E74FSc5b9mySRqRC1I1CRUZQ1VRQEVpoNCiAAigIKIogW6gIjnTHt09MNSdC6zYzpusosZTKbjWuCKqY3c15a64rNxs5hL6p8qiZXlJjtv/j454NXHiC6Y8cVqZpxYagyu9+UNJvQFRLUtt6GsW2Iki9Cl4MYsm++10gSNRJOF0jIooiKCjIitNgAigAoCIKiiAAis21T5QYlVL2v+UaJF9PJNTst3wIxlbePH+V9G+uKtWNCTKzjKNcXo74qXD2qIXH2ZuPZblGbn8KslLKi25eyTd8DRpejnfZJ5QTm9Q1pq8prYJGvSsx01pE1F6NAic3pTS6URQBzVBptQAURRBUERQBFEUAS08IFnB7kvhbOEGSKaUFlkRREt2sqAJlWZHTUNC6x9muNt+n3PSGubWuGtSM5X2D6nAjcgtJ7rTQjKfsvKiqnMVAFRUUYAadFARBQEAAUBEABEoCKulAQ0AIAAAAoAgAAzlAFhPC+aAAAAAIAqgAP/9k=';

import image from '..';

// const writeToFile = (input: HDS.IFileInput): boolean | HDS.IError => {
//   const { path, title, description, content, fileName } = input;
//   if (!input) {
//     throw new Error('Input all fields');
//   }
//   const yml = `---
// title: ${title}
// description: ${description}
// ---
// `;

//   const mdContent = turndown.turndown(content);
//   const markdown = `
// ${yml}

// ${mdContent}
//     `;

//   // const mdContent = converter.makeMarkdown(content, dom.window.document);
//   // const markdown = `${yml}
//   // ${content}
//   //   `;

//   const newPath = `${path}/${fileName}`;
//   try {
//     fs.writeFileSync(newPath, markdown, { encoding: 'utf8' });

//     return true;
//   } catch (er) {
//     return {
//       error: true,
//       message: er.message
//     };
//   }
// };

describe('downloads an image', () => {
  // const res = image.downloadAndOptimizeImage({ base64: data, id: 'akhdskjhf' });
  image.imageCache('/home/divine/Desktop/Jose_project', [data]);
  // console.log({ res });

  it('is true', () => {
    expect(true).toBeTruthy();
  });
});
