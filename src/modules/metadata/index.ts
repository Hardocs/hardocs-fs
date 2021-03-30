import { defaultStandard } from './defaultStandard';
import cwd from '../cwd';
import folder from '../folder';
import file from '../file';
import { getHardocsDir } from './../../utils/constants';
import fs from 'fs/promises';

/**
 * Builds a default schema specification and stores it in `.hardocs/schemas/<filename>`
 */
const generateDefaultSchema = async (path?: string) => {
  // await cwd.set('/home/divine/Desktop');
  const dir = `${path}/.hardocs` ?? getHardocsDir(cwd.get());

  try {
    folder.createFolder({ path: dir, force: true });

    await file.writeToFile({
      content: JSON.stringify(defaultStandard, null, 2),
      path: dir,
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
  const dir = `${schemaDir}/.hardocs` ?? getHardocsDir(cwd.get());

  try {
    file.writeToFile({
      content: JSON.stringify(defaultStandard, null, 2),
      path: dir,
      fileName: 'schema.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Load schema to project
 * @param options
 */
/**
 *
 * @param options Object with  `{
 *  path: string // should be a path
 * }`
 * @returns Json Schema Specification
 */
const loadSchema = async (path?: string) => {
  const dir = `${path}/.hardocs` ?? getHardocsDir(cwd.get());

  const schema = await fs.readFile(`${dir}/schema.json`, {
    encoding: 'utf-8'
  });

  return schema;
};

export { generateDefaultSchema, updateSchema, loadSchema };
