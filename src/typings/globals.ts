// import { Redis } from 'ioredis';

export interface Options {
	path: string;
	force?: boolean;
}

export type Path = Pick<Options, 'path'>;

export type Resolver = (root: any, args: any, info: any) => any;

export interface GeneratedFolder {
	name: string;
	path: string;
}

export interface ResolverMap {
	[key: string]: {
		[key: string]: Resolver;
	};
}
