import { MaybeDocument } from 'nano';

import couch from '../../dbConnection/couch';

export interface Divine extends MaybeDocument {
  name: string;
  email: string;
  age: number;
  nice: boolean;
}

export const resolver = {
  Mutation: {
    createRecord: async (_: any, args: Divine) => {
      try {
        const list = await (await couch).insert(args);

        console.log(list);
        return true;
        // }
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    delete: async (_: any, { id, rev }: { id: string; rev: string }) => {
      const f = await (await couch).destroy(id, rev);
      console.log(f);
      return true;
    }
  },
  Query: {
    findAll: async () => {
      const files = await (await couch).find({
        selector: {}
      });
      console.log(files.docs);
      return true;
    },

    findSingle: async (_: any, { id }: { id: string }) => {
      const file = await (await couch).get(id);
      console.log(file);
      return true;
    }
  }
};
