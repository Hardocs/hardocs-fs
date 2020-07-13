import couch from '../../dbConnection/couch';

export const resolvers = {
  Query: {
    findAll: async () => {
      const docs = await (await couch).find({
        selector: {}
        // fields: ['name', 'email', 'age']
      });

      console.log({ docs });
      return true;
    }
  }
};
