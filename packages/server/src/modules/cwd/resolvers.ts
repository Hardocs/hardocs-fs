import { ResolverMap } from '../../typings/globals';
import cwd from './cwd';

export const resolver: ResolverMap = {
  Query: {
    cwd: () => cwd.get()
  }
};
