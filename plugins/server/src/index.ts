require('dotenv').config();
import server from './server';

server(); // I didn't start the server authomatically
// cbecause we're gonna need the connection durring test that is why i exported it to this filr
