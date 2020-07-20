import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';

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

  const port = process.env.PORT || 4000;
  return app.listen(
    {
      port
    },
    () => console.log(`server is running on http://localhost:${port}`)
  );
};
