import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as glob from 'glob';
import { GraphQLSchema } from 'graphql';

export default (): GraphQLSchema => {
  const pathModules = path.join(__dirname, '../modules');

  const graphqlTypes = glob.sync(`${pathModules}/**/*.graphql`).map((x) => fs.readFileSync(x, 'utf8'));

  const resolvers = glob.sync(`${pathModules}/**/resolvers.?s`).map((r) => require(r).resolver || require(r).default);

  return makeExecutableSchema({
    typeDefs: mergeTypes(graphqlTypes),
    resolvers: mergeResolvers(resolvers)
  });
};
