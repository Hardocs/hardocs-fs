> Pheeew 😫. -- Writing code is one thing while documenting is another difficult thing i'm sure y'all know that.

I think it's easier to explain how everything works in this application over a long session. However, I'll talk a bit about the project structure:

```
.
├── src
│   ├── dbConnection
│   ├── modules
│   │   ├── cwd
│   │   ├── file
│   │   ├── folder
│   │   └── project
│   ├── scripts
│   ├── typings
│   └── utils
└── template
    ├── docsTemplate
    │   └── new
    └── template
```

1 **Templates** -- Contains two directories.

- **docsTemplate**: This directory can contain any sub-folders and files which will be copied over when a person tries to create a new project.
- **template**: This can contain any files we may need to include in the future i.e Hardocs Logo, etc. For now, there's nothing so i just put some random `.json,.env ...` files in it.

1 **src** -- Contains all server side codes and almost every logic of the app.

- **dbConnection**: Contains couchdb config which is not implemented yet.
- **Modules**: Is like a magic folder. it contains almost every functions for this application.
- **scripts**: Contains a script that builds `typings and interfaces` from an auto-generated graphql schema which i'll talk about in a second. You can run the command `npm run gen:types` or `yarn gen:types` and this will generate a `schema.d.ts` file and store it in the `typings` directory. One unique thing about this auto-generated schema is that you don't have to import it to be able to use it because its generated with a namespace. To use the typings you need to use the keyword `HDS` followed by the name of the typing/interface. i.e `HDS.ICreateProjectOnMutationQuery`. BDW, I meant Hardocs by HDS 😉.

3 **typings** -- All types/interfaces/namespaces... goes into this folder. I've created a few typings.

> Note: The `schema.d.ts` file is auto-generated so you don't want to modify it because your changes will be gone whenever it's being rebuilt.

4. **utils** -- This folder contains Utility functions etc. One most important file here is the `generateSchema.ts`. This file looks the the `modules` directory for every `.graphql` and `resolvers.(ts|js)` files and builds a graphql schema so you don't need to manually import your schemas and mutations.

> This file will be updated as new things are being added.
