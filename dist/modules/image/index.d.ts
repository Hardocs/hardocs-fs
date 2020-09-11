import { Context, Options } from '../../typings/globals';
declare const _default: {
    getImages: (path?: string | undefined) => string[];
    handleImagePaths: (markdown: string, context: Context) => string;
    getImagesInHardocsProject: ({ path, context }: Options) => Promise<string | string[]>;
};
export default _default;
