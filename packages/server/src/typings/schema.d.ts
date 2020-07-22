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
    input?: ICreateProjectInput | null;
  }

  interface ICreateProjectInput {
    folder: string;
    force: boolean;
    remote?: string | null;
    clone?: boolean | null;
  }

  interface IProject {
    __typename: 'Project';
    id: string;
    path: string;
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
    author: Array<IAuthor> | null;
    contributors: Array<IContributor> | null;
  }

  interface ILanguage {
    __typename: 'Language';
    name: string;
    description: string;
    longDescription: string;
    keywords: Array<string> | null;
  }

  interface ILicense {
    __typename: 'License';
    hardware: string | null;
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
