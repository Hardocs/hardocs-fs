require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import RateLimit from 'express-rate-limit';
import RateLimitRedisStore from 'rate-limit-redis';
import cors, { CorsOptions } from 'cors';

import redis from './redis';
import generateSchema from './utils/generateSchema';

const RedisStore = RateLimit({
  store: new RateLimitRedisStore({
    client: redis
  }),
  windowMs: 15 * 60 * 100,
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

export default async (): Promise<Server | HTTPSServer> => {
  const schema = generateSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      redis,
      req,
      res
    })
  });

  const app = express();
  const graphqlPath = '/';
  server.applyMiddleware({ app, path: graphqlPath });

  app.use(RedisStore);
  app.use('*', express.static('*'));

  const corsOptions: CorsOptions = {
    origin:
      process.env.NODE_ENV === 'development' ? '*' : 'http://localhost:8000',
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  const port = process.env.PORT || 4001;
  return app.listen(
    {
      port
    },
    () => console.log(`server is running on http://localhost:${port}`)
  );
};