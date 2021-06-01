// tslint:disable

declare namespace HDS {
  interface IFile {
    title: string;
    type: string;
    fileName: string;
  }

  interface IFileInput {
    title?: string;
    path: string;
    content: string;
    fileName?: string;
  }

  interface ICreateProjectInput {
    path: string;
    name: string;
    docsDir: string;
  }

  interface IProject {
    name: string;
    docsDir: string;
    hardocs: Array<IFile | null> | null;
  }

  interface IError {
    error?: boolean;
    message?: string;
  }
}

// tslint:enable
