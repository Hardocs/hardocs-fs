import { Redis } from 'ioredis';

export interface Options {
  path: string;
  context: Context;
  fullPath?: boolean;
}

export type Path = Pick<Options, 'path'>;
export type ContextOnly = {
  context: Context;
};

export interface Context {
  redis: Redis;
  req: Express.Request;
  res: Express.Response;
}

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface GeneratedFolder {
  name: string;
  path: string;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
