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
    getEntryFile: string;
    folderExists: boolean;
    folderCurrent: IFolder | null;
    docsFolder: string;
    getImages: Array<string> | null;
    getImagesInHardocsProject: Array<string | null> | null;
    isHardocsProject: boolean;
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

  interface IGetImagesOnQueryArguments {
    path?: string | null;
  }

  interface IGetImagesInHardocsProjectOnQueryArguments {
    path: string;
  }

  interface IIsHardocsProjectOnQueryArguments {
    path: string;
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

  interface IMutation {
    __typename: 'Mutation';
    openFile: IFile;
    writeToFile: IFile;
    deleteFile: boolean | null;
    folderOpen: IFolder | null;
    folderOpenParent: IFolder | null;
    folderCreate: IFolder | null;
    folderDelete: boolean;
    createProject: IProject;
    createProjectFromExisting: IProject;
    openProject: IProject;
  }

  interface IOpenFileOnMutationArguments {
    filePath: string;
  }

  interface IWriteToFileOnMutationArguments {
    input: IFileInput;
  }

  interface IDeleteFileOnMutationArguments {
    filePath: string;
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

  interface ICreateProjectFromExistingOnMutationArguments {
    input: ICreateProjectInput;
  }

  interface IOpenProjectOnMutationArguments {
    path?: string | null;
    force?: boolean | null;
  }

  interface IFile {
    __typename: 'File';
    title: string;
    path: string;
    content: string;

    /**
     * fullPath: String!
     */
    fileName: string;
  }

  interface IFileInput {
    title?: string;
    path: string;
    content: string;
    fileName: string;
  }

  interface ICreateProjectInput {
    path?: string | null;
    name: string;
    shortTitle?: string | null;
    nameWithOwner?: string | null;

    /**
     * description: String!
     */
    longTitle?: string | null;
    languages?: Array<ILanguageInput | null> | null;
    projectLink?: string | null;
    intendedUse?: string | null;
    made?: boolean | null;
    madeIndependently?: boolean | null;
    license?: Array<ILicenseInput | null> | null;
    author?: IAuthorInput | null;
    contributors?: Array<IContributorInput | null> | null;

    /**
     * @default "docs"
     */
    docsDir: string;

    /**
     * @default "assets"
     */
    assets?: string | null;
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

  /**
   * Project schemas
   */
  interface IProject {
    __typename: 'Project';
    id: string;
    path: string | null;
    name: string;
    shortTitle: string | null;
    nameWithOwner: string | null;
    longTitle: string | null;
    languages: Array<ILanguage> | null;
    projectLink: string | null;
    intendedUse: string | null;
    made: boolean | null;
    madeIndependently: boolean | null;
    license: Array<ILicense | null> | null;
    author: IAuthor | null;
    contributors: Array<IContributor | null> | null;
    docsDir: string;
    allDocsData: Array<IFile | null> | null;
    schema: Schema;
    metadata: Metadata;
    schemas: Schema[];
    assets: string | null;
  }

  interface Metadata {
    label: string;
    content?: Record<string, unknown>;
    path: string;
    hash: string;
  }
  interface Schema {
    label: string;
    content: Record<string, unknown>;
    path: string;
    hash: string;
  }

  interface ILanguage {
    __typename: 'Language';
    name: Lang;
    description: string;
    longDescription: string;
    keywords: Array<string> | null;
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

  interface IError {
    error: boolean;
    message: string;
  }
}

// tslint:enable
