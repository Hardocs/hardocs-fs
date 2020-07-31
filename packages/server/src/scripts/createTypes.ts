import {
  generateNamespace,
  ISchemaToInterfaceOptions
} from '@gql2ts/from-schema';
import { IFromQueryOptions } from '@gql2ts/types';
import * as fs from 'fs';
import * as path from 'path';
import generateSchema from '../utils/generateSchema';

const options: Partial<ISchemaToInterfaceOptions> = {
  ignoredTypes: ['BadGraphType']
};

const overrides: Partial<IFromQueryOptions> = {
  generateInterfaceName: (name) => `IGQL${name}`
};

const typescriptTypes = generateNamespace(
  'HDS',
  generateSchema(),
  options,
  overrides
);
try {
  fs.writeFileSync(
    path.join(__dirname, '../typings/schema-2.d.ts'),
    typescriptTypes
  );
} catch (err) {
  console.log(err);
  process.exit(1);
}
