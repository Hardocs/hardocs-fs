import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
export declare const server: () => Promise<Server | HTTPSServer>;
