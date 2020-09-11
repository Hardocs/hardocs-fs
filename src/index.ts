import { server } from './server';

server(); // I didn't start the server automatically
// because we're gonna need the connection during test that is why i exported it to this

export * from './server';
