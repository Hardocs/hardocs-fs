import cwd from '../cwd';
import folder from '../folder';
import file from '../file';
import { getHardocsDir } from './../../utils/constants';

/**
 * Builds a default schema specification and stores it in `.hardocs/schemas/<filename>`
 */
const generateDefaultSchema = async (options: { schemaDir?: string }) => {
  const { schemaDir } = options;
  // await cwd.set('/home/divine/Desktop');
  const dir = schemaDir ?? getHardocsDir(cwd.get());

  try {
    folder.createFolder({ path: `${dir}/metadata`, force: true });

    file.writeToFile({
      content: JSON.stringify(defaultData, null, 2),
      path: `${dir}/metadata`,
      fileName: 'schema.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Updates schema standard in `.hardocs/schemas/<filename>`
 */
const updateSchema = async (options: { schemaDir?: string; content: any }) => {
  // TODO: Do we need some sort of schema validations? not sure yet!
  const { schemaDir } = options;
  const dir = schemaDir ?? getHardocsDir(cwd.get());

  try {
    file.writeToFile({
      content: JSON.stringify(defaultData, null, 2),
      path: `${dir}/metadata`,
      fileName: 'schema.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Load schema to project
 */
const loadSchema = async (options: { schemaDir?: string; content: any }) => {
  // TODO: Do we need some sort of schema validations? not sure yet!
  const { schemaDir } = options;
  const dir = schemaDir ?? getHardocsDir(cwd.get());

  file.writeToFile({
    content: JSON.stringify(defaultData, null, 2),
    path: `${dir}/metadata`,
    fileName: 'schema.json'
  });
  return true;
};

export { generateDefaultSchema, updateSchema, loadSchema };

const defaultData = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'http://example.com/example.json',
  type: 'object',
  title: 'Design',
  description: 'The root schema comprises the entire JSON document.',
  default: {},
  examples: [
    {
      name: 'A Ventilator',
      domain: 'healthcare',
      description: 'A ventilator that does something'
    }
  ],
  required: ['name', 'domain', 'description'],
  properties: {
    name: {
      $id: '#/properties/name',
      type: 'string',
      title: 'The name schema',
      description: 'An explanation about the purpose of this instance.',
      default: '',
      examples: ['A Ventilator']
    },
    domain: {
      $id: '#/properties/domain',
      type: 'string',
      title: 'The domain schema',
      description: 'An explanation about the purpose of this instance.',
      default: '',
      examples: ['healthcare']
    },
    description: {
      $id: '#/properties/description',
      type: 'string',
      title: 'The description schema',
      description: 'An explanation about the purpose of this instance.',
      default: '',
      examples: ['A ventilator that does something']
    }
  },
  additionalProperties: true
};
