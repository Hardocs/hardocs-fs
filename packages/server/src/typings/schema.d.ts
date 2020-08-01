// tslint:disable
// graphql typescript definitions

declare namespace HDS {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    cwd: string;
    openFile: IFile;
    getEntryFile: string;
    folderExists: boolean;
    folderCurrent: IFolder | null;
    docsFolder: string;
    openProject: IProject;
    isHardocsProject: boolean;
  }

  interface IOpenFileOnQueryArguments {
    filePath: string;
  }

  interface IGetEntryFileOnQueryArguments {
    path: string;
    force: boolean;
  }

  interface IFolderExistsOnQueryArguments {
    path: string;
  }

  interface IDocsFolderOnQueryArguments {
    path: string;
  }

  interface IOpenProjectOnQueryArguments {
    path?: string | null;
    force?: boolean | null;
  }

  interface IIsHardocsProjectOnQueryArguments {
    path: string;
  }

  interface IFile {
    __typename: 'File';
    title: string;
    description: string;
    path: string;
    content: string;
  }

  interface IFolder {
    __typename: 'Folder';
    name: string;
    path: string;
    isPackage: boolean | null;
    isHardocsProject: boolean | null;
    children: Array<IFolder | null> | null;
    hidden: boolean | null;
  }

  /**
   * Project schemas
   */
  interface IProject {
    __typename: 'Project';
    id: string;
    path: string | null;
    name: string;
    shortTitle: string;
    nameWithOwner: string;
    longTitle: string;
    languages: Array<ILanguage> | null;
    projectLink: string;
    intendedUse: string;
    made: boolean;
    madeIndependently: boolean;
    license: Array<ILicense | null> | null;
    updatedAt: string;
    author: IAuthor;
    contributors: Array<IContributor> | null;
    docsDir: string;
    allDocsMetadata: Array<IAllDocsMetadata>;
    entryFile: string;
  }

  interface ILanguage {
    __typename: 'Language';
    name: Lang;
    description: string;
    longDescription: string;
    keywords: Array<string> | null;
  }

  const enum Lang {
    /**
     * English
     */
    EN = 'EN',

    /**
     * French
     */
    FR = 'FR',

    /**
     * Chineese
     */
    CH = 'CH'
  }

  interface ILicense {
    __typename: 'License';

    /**
     * Name of license. i.e MIT, ISC, Apache License etc.
     */
    name: string;
    file: string;
  }

  interface IAuthor {
    __typename: 'Author';
    name: string;
    affiliation: string;
  }

  interface IContributor {
    __typename: 'Contributor';
    name: string;
  }

  interface IAllDocsMetadata {
    __typename: 'AllDocsMetadata';
    title: string;
    description: string;
    fileName: string;
    content: string | null;
  }

  interface IMutation {
    __typename: 'Mutation';
    folderOpen: IFolder | null;
    folderOpenParent: IFolder | null;
    folderCreate: IFolder | null;
    folderDelete: boolean;
    createProject: IProject;
  }

  interface IFolderOpenOnMutationArguments {
    path: string;
  }

  interface IFolderCreateOnMutationArguments {
    name: string;
  }

  interface IFolderDeleteOnMutationArguments {
    path: string;
  }

  interface ICreateProjectOnMutationArguments {
    input: ICreateProjectInput;
  }

  interface ICreateProjectInput {
    name: string;
    shortTitle?: string | null;
    nameWithOwner: string;
    longTitle: string;
    languages?: Array<ILanguageInput> | null;
    projectLink: string;
    intendedUse: string;
    made: boolean;
    madeIndependently: boolean;
    license?: Array<ILicenseInput | null> | null;
    author: IAuthorInput;
    contributors?: Array<IContributorInput> | null;

    /**
     * @default "docs"
     */
    docsDir: string;

    /**
     * @default "index.md"
     */
    entryFile: string;
  }

  /**
   * Input type for language.
   */
  interface ILanguageInput {
    /**
     * The name is a required field and it must be one of EN, FR or CH
     */
    name: Lang;
    description: string;
    longDescription: string;
    keywords?: Array<string> | null;
  }

  interface ILicenseInput {
    /**
     * Name of license. i.e MIT, ISC, Apache License etc.
     */
    name: string;

    /**
     * Specify the name of the file that will contain your license. Defaults to LICENSE
     * @default "LICENSE"
     */
    file: string;
  }

  interface IAuthorInput {
    name: string;
    affiliation: string;
  }

  interface IContributorInput {
    name: string;
  }
}

// tslint:enable
