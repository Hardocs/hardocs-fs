import {
  generateNamespace,
  ISchemaToInterfaceOptions
} from '@gql2ts/from-schema';
import * as fs from 'fs';
import * as path from 'path';
import generateSchema from '../utils/generateSchema';

const options: Partial<ISchemaToInterfaceOptions> = {
  ignoredTypes: ['BadGraphType']
};

const typescriptTypes = generateNamespace('HDS', generateSchema(), options);
try {
  fs.writeFileSync(
    path.join(__dirname, '../typings/schema.d.ts'),
    typescriptTypes
  );
} catch (err) {
  console.log(err);
  process.exit(1);
}
