import * as Nano from 'nano';

export default (async () => {
  const dbName = 'hello';
  const nano = Nano(process.env.DB_HOST_AUTH);

  const dbList = await nano.db.list(); // Returns a list of database

  try {
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
      const db = nano.use(dbName);
      console.log('database created successfully');
      return db;
    }
  } catch (err) {
    throw new Error(err);
  }
})();
