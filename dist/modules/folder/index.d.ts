import { ContextOnly } from './../../typings/globals';
import { Redis } from 'ioredis';
import { Options, GeneratedFolder } from '../../typings/globals';
declare const _default: {
    isDirectory: ({ path: file }: Pick<Options, "path">) => boolean;
    generateFolder: ({ path: file }: Pick<Options, "path">) => GeneratedFolder;
    getCurrent: () => GeneratedFolder;
    open: ({ path: file }: Pick<Options, "path">) => Promise<GeneratedFolder>;
    openParent: ({ path: file }: Pick<Options, "path">) => GeneratedFolder;
    createFolder: ({ path: name }: Pick<Options, "path">) => false | GeneratedFolder;
    list: ({ path: base }: Pick<Options, "path">) => Promise<{
        path: string;
        name: string;
        hidden: boolean | void;
    }[]>;
    isHidden: ({ path: file }: Pick<Options, "path">) => boolean | void;
    getDocsFolder: ({ path, context, force }: Partial<Options> & ContextOnly) => Promise<string>;
    readPackage: (options: Partial<Options> & ContextOnly) => Promise<any>;
    clearCachedValue: ({ file, redis }: {
        file: string;
        redis: Redis;
    }) => Promise<boolean>;
    isHardocsProject: ({ path, context }: Partial<Options> & ContextOnly) => Promise<boolean>;
    deleteFolder: ({ path }: Pick<Options, "path">) => Promise<boolean>;
};
export default _default;
