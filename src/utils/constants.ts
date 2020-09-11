import * as path from 'path';

export const getHardocsDir = (p: string) => path.join(p, '.hardocs');

export const __DEV__ = process.env.NODE_ENV === 'development';
export const __PROD__ = process.env.NODE_ENV === 'production';
export const __TEST__ = process.env.NODE_ENV === 'test';
