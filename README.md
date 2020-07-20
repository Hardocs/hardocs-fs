# Hardocs (monorepo/plugin based implementation)

I've set up `eslint` for linting and `prettier` for code formatting.

This is a plugin/monorepo based aproach in building hardocs where every part of the application is treated as a plugin. example: The `server` which is located inside the plugins directory is a plugin and every other thing we are going to add like (electron for desktop and gridsome for web) is going to be treated as a plugin.

Another fun part of this monorepo aproach using [`yarn workspaces`](https://classic.yarnpkg.com/en/docs/workspaces/) is that your packages are in one giant `node_modules` folder located the the root foolder of this project and the rest `node_modules` in the `plugins/*` directory is just a link to the parent giant node module.

> **Note** that if you are adding a new plugin you will have to create a folder with the name of the plugin and the **naming convention** for a plugin will be prefixed with `@hardocs/<plugin-name>` i.e `@hardocs/server`.

## Always write clean commit messages and prefix it with an emoji.

- 🐛 for bug fix
- 🚀 for creating a new plugin
- ✨ for adding a new features
- Any fruit, food or plant for simple fixes 🍍 🍎 🍏 🍓

Feel free to suggest an emoji 😼

## Getting started

clone this repo by running:

```bash
git clone git@github.com:Hardocs/hardocs-plugin-based.git
```

Install all the required dependencies by running

```bash
yarn
# or
npm install
```

## Using the server plugin

change directory into the server directory:

```bash
cd ./packages/server
```

run the following command to start the server on [http://localhost:4000](http://localhost:4000)

```bash
yarn dev
# or
npm run dev
```
