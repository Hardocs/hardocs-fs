import { Options } from '../../typings/globals';
declare const _default: {
    openFile: ({ path: filePath, force, context }: Options) => {
        title: any;
        description: any;
        content: string;
        fileName: string | false;
        path: string;
    };
    allMarkdownFilesPath: (filePath?: string | undefined) => string[];
    getEntryFilePath: ({ path: projectPath, context, force }: Options) => Promise<string>;
    getHardocsJsonFile: ({ path, context, force }: Options) => Promise<{
        hardocsJson: HDS.IProject;
        currentDir: string;
    }>;
    createMarkdownTemplate: (entryPath: string, filename: string, path: string) => Promise<void>;
    openEntryFile: ({ path, context, force }: Options) => Promise<{
        title: any;
        description: any;
        content: string;
        fileName: string | false;
        path: string;
    }>;
    extractAllFileData: ({ path, context }: Options) => Promise<{
        title: any;
        description: any;
        content: string;
        fileName: string | false;
        path: string;
    }[]>;
    getFileName: ({ path }: Pick<Options, "path">) => string | false;
    writeToFile: (input: HDS.IFileInput) => {
        path: string;
        title: string;
        description: string;
        content: string;
        fileName: string;
    };
    delete: ({ filePath }: HDS.IDeleteFileOnMutationArguments) => boolean;
    exists: (path: string) => boolean;
};
export default _default;
