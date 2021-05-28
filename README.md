# Hardocs Fs (File System) module

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
    docsDir: 'docs'
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://divinehycenth.com/"><img src="https://avatars.githubusercontent.com/u/49137104?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Divine Hycenth</b></sub></a><br /><a href="https://github.com/Hardocs/hardocs-fs/commits?author=DNature" title="Code">💻</a> <a href="#content-DNature" title="Content">🖋</a> <a href="#design-DNature" title="Design">🎨</a> <a href="https://github.com/Hardocs/hardocs-fs/commits?author=DNature" title="Documentation">📖</a> <a href="#ideas-DNature" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-DNature" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
