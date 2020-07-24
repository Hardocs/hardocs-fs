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
    folderExists: boolean | null;
    folderCurrent: IFolder | null;
  }

  interface IFolderExistsOnQueryArguments {
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
    folderOpen: IFolder | null;
    folderOpenParent: IFolder | null;
    folderCreate: IFolder | null;
    createProject: IProject;
  }

  interface IFolderOpenOnMutationArguments {
    path: string;
  }

  interface IFolderCreateOnMutationArguments {
    name: string;
  }

  interface ICreateProjectOnMutationArguments {
    input: ICreateProjectInput;
  }

  interface ICreateProjectInput {
    /**
     * path: String!
     */
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
    CH = 'CH',
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
}

// tslint:enable
