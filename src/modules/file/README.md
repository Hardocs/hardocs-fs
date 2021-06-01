# File

The file module is used to perform some basic to advanced file system operations mostly in hardocs.

## Basic Usage

```js
import { file } from 'hardocs-fs';

// Alternatively, you can also import this module directly
import file from 'hardocs-fs/modules/file';
```

### Save a file

This method accepts an object with the following properties:

- `title`: Title of the document | Usually used to generate a sidebar display name for each the file.
- `path`: path to the folder your want to save the file to
- `content`: The content you want to be saved in the file.
- `fileName`: The name of the file.

```js
await file.writeToFile({
  title: 'Title of the file',
  path: 'os-path',
  content: '<h1>Hello world</h1>',
  fileName: 'example.html'
});
```

### Delete file

As the name implies, This method completely deletes a file.
It only takes one argument which is an object with:

- `filePath`: Path to file that you want to delete.

```js
file.deleteFile();
```
