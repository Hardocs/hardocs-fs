export type Resolver = (root: any, args: any, context: any, info: any) => any;

export interface GeneratedFolder {
  name: string;
  path: string;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
