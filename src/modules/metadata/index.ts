import RefParser from '@apidevtools/json-schema-ref-parser';
import fs from 'fs';
import cwd from '../cwd';
import file from '../file';
import { getHardocsDir } from './../../utils/constants';

interface UpdateSchemaParams {
  path?: string;
  content: Record<string, unknown>;
  name?: string;
}

/**
 * This method can be used to create or update a schema
 * @param opts Object containing a path and a schema standard
 * the path parameter is optionalk
 * @returns JSON object
 */
const bootstrapSchema = async (opts: UpdateSchemaParams) => {
  const { path, content, name = 'schema' } = opts;
  // TODO: Do we need some sort of schema validations? not sure yet!
  const dir = path ?? getHardocsDir(cwd.get());

  try {
    await file.writeToFile({
      content: JSON.stringify(content, null, 2),
      path: dir,
      fileName: `${name}.json`
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
const schemaFromURL = async (url: string, name: string, path?: string) => {
  try {
    const dir = path || getHardocsDir(cwd.get());
    const schema = await RefParser.dereference(url);

    if (!schema) {
      throw new Error('Invalid schema');
    }
    const response = {
      content: JSON.stringify(schema, null, 2),
      path: dir,
      fileName: `${name}.json`
    };

    const isWritten = await file.writeToFile(response);

    return isWritten;
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
const loadSchema = async (name: string, path?: string): Promise<HDS.Schema> => {
  const dir = path ?? getHardocsDir(cwd.get());

  const schema = await fs.promises.readFile(`${dir}/${name}.json`, {
    encoding: 'utf-8'
  });

  return {
    name,
    content: JSON.parse(schema),
    path: dir,
    fileName: `${name}.json`
  };
};

const loadMetadata = async (
  path: string,
  docsDir: string,
  name: string
): Promise<HDS.Metadata> => {
  const dir = path ?? cwd.get();

  const metadata = await fs.promises.readFile(
    `${dir}/${docsDir}/metadata.json`,
    {
      encoding: 'utf-8'
    }
  );

  return {
    name,
    content: JSON.parse(metadata),
    path: `${dir}/${docsDir}`,
    fileName: `${name}.json`
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
