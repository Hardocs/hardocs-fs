import server from './server';
import { __PROD__ } from './utils/constants';

server(); // I didn't start the server automatically
// because we're gonna need the connection during test that is why i exported it to this
if (__PROD__) {
  console.log = () => {};
}
export * from './server';
