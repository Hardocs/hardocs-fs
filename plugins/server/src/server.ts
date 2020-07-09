import { GraphQLServer } from 'graphql-yoga';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import generateSchema from './utils/generateSchema';

export default async (): Promise<Server | HTTPSServer> => {
  const schema = generateSchema();

  const server = new GraphQLServer({
    schema
  });

  const port = process.env.PORT || 4000;

  return await server.start(
    {
      port
    },
    () => console.log(`server is running on http://localhost:${port}`)
  );
};
