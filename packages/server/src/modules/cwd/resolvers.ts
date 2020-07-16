import cwd from './cwd';

const resolver = {
  Query: {
    cwd: () => cwd.get()
  }
};

export default resolver;
