# Hardocs Fs (File System) module

This module is used to perform most file system operations in [hardocs-desktop](https://hardocs.github.io) app.

## Installation

```sh
npm install hardocs-fs
  # or
yarn add hardocs-fs
```

Hardocs Fs exports a lot of modules which includes `project`, `file` and `cwd` etc for most operations.

## Basic Usage

Get your os current working directory:

```js
const { cwd } = require('hardocs-fs');

cwd.get(); // => returns current working directory

cwd.set('path-to-dir'); // => Sets specified path as the current working directory.
```

### Create a hardocs project (Basic)

```js
const { project } = require('hardocs-fs');

project
  .create({
    name: 'test-project',
    docsDir: 'docs',
    entryFile: 'index.html'
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```

### File operations (Basic delete operation)

```js
const { file } = require('hardocs-fs');

file.delete({ filePath: '/path-to-file' });
```
