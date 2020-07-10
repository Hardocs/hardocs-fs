import { GraphQLServer } from 'graphql-yoga';
import { Server } from 'http';
import { Server as HTTPSServer } from 'https';
import generateSchema from './utils/generateSchema';
// import * as Nano from 'nano';

export default async (): Promise<Server | HTTPSServer> => {
  // const db_name = 'test';
  // const nano = Nano({
  //   url: process.env.DB_HOST_AUTH,
  //   log: (id, args) => {
  //     console.log(id, args);
  //   }
  // });
  // const db = nano.use(db_name);
  // interface iPerson extends Nano.MaybeDocument {
  //   name: string;
  //   dob: string;
  // }

  // class Person implements iPerson {
  //   _id: string;
  //   _rev: string;
  //   name: string;
  //   dob: string;

  //   constructor(name: string, dob: string) {
  //     this._id = undefined;
  //     this._rev = undefined;
  //     this.name = name;
  //     this.dob = dob;
  //   }

  //   processAPIResponse(response: Nano.DocumentInsertResponse) {
  //     if (response.ok === true) {
  //       this._id = response.id;
  //       this._rev = response.rev;
  //     }
  //   }
  // }

  // const p = new Person('Bob', '2015-02-04');
  // db.insert(p).then((response) => {
  //   p.processAPIResponse(response);
  //   console.log(p);
  // });
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
