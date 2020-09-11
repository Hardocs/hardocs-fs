/// <reference types="express-serve-static-core" />
import { Redis } from 'ioredis';
export interface Options {
    path: string;
    context: Context;
    force?: boolean;
}
export declare type Path = Pick<Options, 'path'>;
export declare type ContextOnly = {
    context: Context;
};
export interface Context {
    redis: Redis;
    req: Express.Request;
    res: Express.Response;
    url: string;
}
export declare type Resolver = (root: any, args: any, context: Context, info: any) => any;
export interface GeneratedFolder {
    name: string;
    path: string;
}
export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}
