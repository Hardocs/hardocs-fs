import { defaultStandard } from './defaultStandard';
import cwd from '../cwd';
import file from '../file';
import { getHardocsDir } from './../../utils/constants';
import fs from 'fs/promises';

interface UpdateSchemaParams {
  path?: string;
  content: Record<string, unknown>;
}

/**
 * This method can be used to create or update a schema
 * @param opts Object containing a path and a schema standard
 * the path parameter is optionalk
 * @returns JSON object
 */
const bootstrapSchema = async (opts: UpdateSchemaParams) => {
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

interface DefaultMetadataProps {
  path: string;
  docsDir: string;
}

const generateDefaultMetadata = async (opts: DefaultMetadataProps) => {
  const { path, docsDir } = opts;
  // await cwd.set('/home/divine/Desktop');

  try {
    await file.writeToFile({
      content: JSON.stringify(defaultStandard, null, 2),
      path: `${path}/${docsDir}`,
      fileName: 'metadata.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export { loadSchema, bootstrapSchema, generateDefaultMetadata };
