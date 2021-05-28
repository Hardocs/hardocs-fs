export const defaultStandard = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Configuration files for the esm module/package in Node.js',
  properties: {
    cjs: {
      description: 'A boolean or object for toggling CJS features in ESM',
      default: true,
      oneOf: [
        {
          type: 'boolean',
          default: true
        },
        {
          type: 'object',
          properties: {
            cache: {
              type: 'boolean',
              description: 'A boolean for storing ES modules in require.cache',
              default: true
            },
            esModule: {
              type: 'boolean',
              description: 'A boolean for __esModule interoperability',
              default: true
            },
            extensions: {
              type: 'boolean',
              description: 'A boolean for respecting require.extensions in ESM',
              default: true
            },
            mutableNamespace: {
              type: 'boolean',
              description:
                'A boolean for importing named exports of CJS modules',
              $comment:
                'https://ponyfoo.com/articles/es6-modules-in-depth#import-all-the-things',
              default: true
            },
            namedExports: {
              type: 'boolean',
              description:
                'A boolean for importing named exports of CJS modules',
              $comment:
                'https://ponyfoo.com/articles/es6-modules-in-depth#importing-named-exports',
              default: true
            },
            paths: {
              type: 'boolean',
              description: 'A boolean for following CJS path rules in ESM',
              $comment:
                'https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#432-removal-of-non-local-dependencies',
              default: true
            },
            vars: {
              type: 'boolean',
              description:
                'A boolean for __dirname, __filename, and require in ESM',
              default: true
            },
            dedefault: {
              type: 'boolean',
              description:
                'A boolean for requiring ES modules without the dangling require().default',
              default: false
            },
            topLevelReturn: {
              type: 'boolean',
              description: 'A boolean for top-level return support',
              default: false
            }
          }
        }
      ]
    },
    mainFields: {
      type: 'array',
      description: 'An array of fields checked when importing a package',
      default: ['main'],
      uniqueItems: true,
      items: {
        type: 'string',
        description: 'Fields from package.json'
      }
    },
    mode: {
      type: 'string',
      description:
        'A string describing the mode in which to detect ESM module files',
      default: 'auto',
      oneOf: [
        {
          const: 'auto',
          description:
            "'auto' detect files with import, import.meta, export, 'use module', or .mjs as ESM",
          $comment: 'https://github.com/tc39/proposal-modules-pragma'
        },
        {
          const: 'all',
          description:
            "'all' files besides those with 'use script' or .cjs are treated as ESM"
        },
        {
          const: 'strict',
          description: "'strict to treat only .mjs files as ESM"
        }
      ]
    },
    await: {
      type: 'boolean',
      description:
        'A boolean for top-level await in modules without ESM exports. (Node 10+)',
      $comment: 'https://github.com/tc39/proposal-top-level-await',
      default: false
    },
    force: {
      type: 'boolean',
      description: 'A boolean to apply these options to all module loads',
      default: false
    },
    wasm: {
      type: 'boolean',
      description: 'A boolean for WebAssembly module support. (Node 8+)',
      $comment: 'https://nodejs.org/api/globals.html#globals_webassembly',
      default: false
    },
    cache: {
      type: 'boolean',
      description:
        '[dev] A boolean for toggling cache creation or a cache directory path',
      default: true
    },
    sourceMap: {
      type: 'boolean',
      description: '[dev] A boolean for including inline source maps',
      default: false
    }
  },
  additionalProperties: false
};
