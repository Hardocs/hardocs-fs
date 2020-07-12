import { GraphQLServer } from 'graphql-yoga';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import generateSchema from './utils/generateSchema';
import * as Nano from 'nano';
import { MaybeDocument } from 'nano';

interface Divine extends MaybeDocument {
  name: string;
  email: string;
  age: number;
  nice: boolean;
}

const doc: Divine = {
  name: 'Nature',
  email: 'divinehycenth@yahoo.com',
  age: 22,
  nice: true
};

export default async (): Promise<Server | HTTPSServer> => {
  const schema = generateSchema();
  const dbName = 'hello';
  const nano = Nano(process.env.DB_HOST_AUTH);

  // const dbList = await nano.db.list(); // Returns a list of database

  try {
    // if (!dbList.includes(dbName)) {
    // await nano.db.create(dbName);
    const db = nano.use(dbName);
    console.log('database created successfully');
    const list = await db.insert(doc);

    console.log(list);
    // }
  } catch (err) {
    throw new Error(err);
  }

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
