# Current Working Directory (CWD)
This module can be used to either get or set your current working directory irrespective of your OS.

## Basic Usage

```js
import { cwd } from 'hardocs-fs'

// Alternatively, you can also import this module directly

import cwd from 'hardocs-fs/modules/cwd'
```

### Get Current working directory

```js
cwd.get(); // Returns current working directory.
```

### Set Current working directory

The set method accepts a valid path argument.

```js
cwd.set('path-to-directory'); // Returns current working directory.
```
