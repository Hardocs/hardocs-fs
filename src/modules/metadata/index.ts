import RefParser from '@apidevtools/json-schema-ref-parser';
import fs from 'fs';
import cwd from '../cwd';
import file from '../file';
import { getHardocsDir } from './../../utils/constants';

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
 *
 * @param url URL to schema
 * @returns schema object
 */
const schemaFromURL = async (url: string, name: string) => {
  try {
    const dir = getHardocsDir(cwd.get());
    const schema = await RefParser.dereference(url);

    if (!schema) {
      throw new Error('Invalid schema');
    }
    const response = {
      content: JSON.stringify(schema, null, 2),
      path: dir,
      fileName: `${name}.json`
    };
    await file.writeToFile(response);

    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 *
 * @param options Object with  `{
 *  path: string // should be a path
 * }`
 * @returns Json Schema Specification
 */
const loadSchema = async (path?: string): Promise<HDS.Schema> => {
  const dir = path ?? getHardocsDir(cwd.get());

  const schema = await fs.promises.readFile(`${dir}/schema.json`, {
    encoding: 'utf-8'
  });

  return {
    fileName: 'schema.json',
    content: JSON.parse(schema),
    path: dir
  };
};

const loadMetadata = async (
  path: string,
  docsDir: string
): Promise<HDS.Metadata> => {
  const dir = path ?? cwd.get();

  const metadata = await fs.promises.readFile(
    `${dir}/${docsDir}/metadata.json`,
    {
      encoding: 'utf-8'
    }
  );

  return {
    fileName: 'metadata.json',
    content: JSON.parse(metadata),
    path: `${dir}/${docsDir}`
  };
};

interface DefaultMetadataProps {
  path: string;
  docsDir: string;
  content: Record<string, unknown>;
}

const generateMetadata = async (opts: DefaultMetadataProps) => {
  const { path, docsDir, content } = opts;
  // await cwd.set('/home/divine/Desktop');

  try {
    await file.writeToFile({
      content: JSON.stringify(content, null, 2),
      path: `${path}/${docsDir}`,
      fileName: 'metadata.json'
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default {
  loadSchema,
  bootstrapSchema,
  generateMetadata,
  loadMetadata,
  schemaFromURL
};
