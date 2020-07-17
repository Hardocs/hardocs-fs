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
    file: string;
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
  }

  interface IFolderOpenOnMutationArguments {
    path: string;
  }
}

// tslint:enable
