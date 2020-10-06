import { __DEV__ } from './utils/constants';
import { server } from './server';

if (__DEV__) {
  server(); // I didn't start the server automatically
  // because we're gonna need the connection during test that is why i exported it to this
}
export * from './server';
export * from './modules';
