import { Redis } from 'ioredis';

export interface FolderProjectOptions {
  path: string;
  redis?: Redis;
}

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
