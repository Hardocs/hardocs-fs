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
  const dir = path ?? getHardocsDir(cwd.get());

  try {
    folder.createFolder({ path: dir, force: true });

    await file.writeToFile({
      content: JSON.stringify(defaultStandard, null, 2),
      path: `${dir}/.hardocs`,
      fileName: 'schema.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
interface UpdateSchemaParams {
  path?: string;
  content: Record<string, unknown>;
}

/**
 * Updates schema standard in `.hardocs/schemas/<filename>`
 * @param content Object containing a schema standard
 * @returns JSON object
 */
const updateSchema = async (opts: UpdateSchemaParams) => {
  const { path, content } = opts;
  // TODO: Do we need some sort of schema validations? not sure yet!
  const dir = path ?? getHardocsDir(cwd.get());

  try {
    await file.writeToFile({
      content: JSON.stringify(content, null, 2),
      path: dir,
      fileName: 'schema.json'
    });
    return JSON.stringify(content, null, 2);
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
