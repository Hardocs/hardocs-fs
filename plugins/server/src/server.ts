import { GraphQLServer } from 'graphql-yoga';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';

import generateSchema from './utils/generateSchema';
// import couch from './dbConnection/couch';

export default async (): Promise<Server | HTTPSServer> => {
  const schema = generateSchema();
  // const dbList = await nano.db.list(); // Returns a list of database

  // try {
  //   const list = await (await couch).find({
  //     selector: {}
  //   });

  //   console.log(list);
  //   // }
  // } catch (err) {
  //   throw new Error(err);
  // }

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
