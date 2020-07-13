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
      //   const doc: Divine = {
      //     name: 'Nature',
      //     email: 'divinehycenth@yahoo.com',
      //     age: 22,
      //     nice: true
      //   };

      try {
        const list = await (await couch).insert(args);

        console.log(list);
        return true;
        // }
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }
};
