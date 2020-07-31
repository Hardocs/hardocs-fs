// tslint:disable
// graphql typescript definitions

declare namespace HDS {
  interface IGQLGraphQLResponseRoot {
    data?: IGQLQuery | IGQLMutation;
    errors?: Array<IGQLGraphQLResponseError>;
  }

  interface IGQLGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGQLGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGQLGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IGQLQuery {
    __typename: 'Query';
    cwd: string;
    openFile: IGQLFile;
    folderExists: boolean;
    folderCurrent: IGQLFolder | null;
    openProject: IGQLProject;
    isHardocsProject: boolean;
  }

  interface IGQLopenFile_On_QueryArguments {
    filePath: string;
  }

  interface IGQLfolderExists_On_QueryArguments {
    path: string;
  }

  interface IGQLopenProject_On_QueryArguments {
    path?: string | null;
    fullPath?: boolean | null;
  }

  interface IGQLisHardocsProject_On_QueryArguments {
    path: string;
  }

  interface IGQLFile {
    __typename: 'File';
    title: string;
    description: string;
    path: string;
    content: string;
  }

  interface IGQLFolder {
    __typename: 'Folder';
    name: string;
    path: string;
    isPackage: boolean | null;
    isHardocsProject: boolean | null;
    children: Array<IGQLFolder | null> | null;
    hidden: boolean | null;
  }

  /**
   * Project schemas
   */
  interface IGQLProject {
    __typename: 'Project';
    id: string;
    path: string | null;
    name: string;
    shortTitle: string;
    nameWithOwner: string;
    longTitle: string;
    languages: Array<IGQLLanguage> | null;
    projectLink: string;
    intendedUse: string;
    made: boolean;
    madeIndependently: boolean;
    license: Array<IGQLLicense | null> | null;
    updatedAt: string;
    author: IGQLAuthor;
    contributors: Array<IGQLContributor> | null;
    docsDir: string;
    allDocsMetadata: Array<IGQLAllDocsMetadata>;
    entryFile: string;
  }

  interface IGQLLanguage {
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
    CH = 'CH',
  }

  interface IGQLLicense {
    __typename: 'License';

    /**
     * Name of license. i.e MIT, ISC, Apache License etc.
     */
    name: string;
    file: string;
  }

  interface IGQLAuthor {
    __typename: 'Author';
    name: string;
    affiliation: string;
  }

  interface IGQLContributor {
    __typename: 'Contributor';
    name: string;
  }

  interface IGQLAllDocsMetadata {
    __typename: 'AllDocsMetadata';
    title: string;
    description: string;
    fileName: string;
  }

  interface IGQLMutation {
    __typename: 'Mutation';
    folderOpen: IGQLFolder | null;
    folderOpenParent: IGQLFolder | null;
    folderCreate: IGQLFolder | null;
    createProject: IGQLProject;
  }

  interface IGQLfolderOpen_On_MutationArguments {
    path: string;
  }

  interface IGQLfolderCreate_On_MutationArguments {
    name: string;
  }

  interface IGQLcreateProject_On_MutationArguments {
    input: IGQLCreateProjectInput;
  }

  interface IGQLCreateProjectInput {
    name: string;
    shortTitle?: string | null;
    nameWithOwner: string;
    longTitle: string;
    languages?: Array<IGQLLanguageInput> | null;
    projectLink: string;
    intendedUse: string;
    made: boolean;
    madeIndependently: boolean;
    license?: Array<IGQLLicenseInput | null> | null;
    author: IGQLAuthorInput;
    contributors?: Array<IGQLContributorInput> | null;

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
  interface IGQLLanguageInput {
    /**
     * The name is a required field and it must be one of EN, FR or CH
     */
    name: Lang;
    description: string;
    longDescription: string;
    keywords?: Array<string> | null;
  }

  interface IGQLLicenseInput {
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

  interface IGQLAuthorInput {
    name: string;
    affiliation: string;
  }

  interface IGQLContributorInput {
    name: string;
  }
}

// tslint:enable
