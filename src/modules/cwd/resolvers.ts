import { ResolverMap } from '../../typings/globals';
import cwd from '.';

export const resolver: ResolverMap = {
  Query: {
    cwd: () => cwd.get()
  }
};
