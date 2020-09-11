require('dotenv').config();
import { ApolloServer, CorsOptions } from 'apollo-server-express';
import express from 'express';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import RateLimit from 'express-rate-limit';
import RateLimitRedisStore from 'rate-limit-redis';
import * as path from 'path';
import * as fs from 'fs-extra';
import mime from 'mime-types';

import redis from './redis';
import generateSchema from './utils/generateSchema';
import cwd from './modules/cwd';
import { __PROD__ } from './utils/constants';

const RedisStore = RateLimit({
  store: new RateLimitRedisStore({
    client: redis
  }),
  windowMs: 15 * 60 * 100,
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

export const server = async (): Promise<Server | HTTPSServer> => {
  const schema = generateSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      redis,
      req,
      res,
      url: req.protocol + '://' + req.get('host')
    }),
    introspection: true
  });

  const app = express();
  // const graphqlPath = '/';
  const corsOptions: CorsOptions = {
    origin:
      process.env.NODE_ENV === 'development' ? '*' : 'http://localhost:8080',
    optionsSuccessStatus: 200
  };

  server.applyMiddleware({ app, cors: corsOptions });
  app.use(RedisStore);

  app.use('/images', express.static('images'));
  app.use(express.static(cwd.get()));
  app.get('*', (req, res) => {
    const file = path.join(cwd.get(), req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(cwd.get() + path.sep) !== 0) {
      return res.status(403).end('Forbidden');
    }
    const type = mime.types[path.extname(file).slice(1)] || 'text/plain';

    const s = fs.createReadStream(file);
    s.on('open', () => {
      res.set('Content-Type', type);
      s.pipe(res);
    });

    s.on('error', () => {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not Found');
    });
  });

  const port = process.env.PORT || 4001;
  return app.listen(
    {
      port
    },
    () =>
      console.log(
        `server is running on http://localhost:${port}${server.graphqlPath}`
      )
  );
};

if (__PROD__) {
  console.log = () => {};
}
