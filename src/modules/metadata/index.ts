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

const formatName = (name: string) =>
  name.split(' ').join('-').trim().toLowerCase();

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
      fileName: `${formatName(name)}.json`
    });

    return {
      content,
      fileName: `${formatName(name)}.json`,
      path: dir,
      name
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const processMetadata = async (data: any) => {
  const { path, docsDir, label, schemaUrl } = data;
  const metadata = {
    path: `${path}/${docsDir}/${formatName(label)}-metadata.json`,
    fileName: `${formatName(label)}-metadata.json`,
    title: label,
    type: 'record',
    schema: {
      source: schemaUrl,
      path: `${path}/.hardocs/${formatName(label)}-schema.json`,
      fileName: `${formatName(label)}-schema.json`
    }
  };

  const schema = await RefParser.dereference(schemaUrl);
  const schemaPromise = file.writeToFile(
    {
      content: JSON.stringify(schema, null, 2),
      path: metadata.schema.path
    },
    true
  );

  const metadataPromise = file.writeToFile(
    {
      content: JSON.stringify({}, null, 2),
      path: `${path}/${docsDir}`
    },
    true
  );

  await Promise.all([metadataPromise, schemaPromise]);
  return metadata;
};

/**
 *
 * @param url URL to schema
 * @param title Name of schema
 * @param path <optional> a folder that this schema should be stored in
 * @returns schema object
 */
const schemaFromURL = async (url: string, title: string, path?: string) => {
  try {
    const dir = path || getHardocsDir(cwd.get());
    const schema = await RefParser.dereference(url);

    if (!schema) {
      throw new Error('Invalid schema');
    }
    const response = {
      content: JSON.stringify(schema, null, 2),
      path: dir,
      fileName: `${formatName(title)}.json`,
      source: url
    };

    const isWritten = await file.writeToFile(response);

    if (isWritten !== true) {
      throw new Error('Unable to write schema.');
    }

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
const loadSchema = async (name: string, path?: string) => {
  const dir = path ?? getHardocsDir(cwd.get());

  const schema = await fs.promises.readFile(`${dir}/${name}.json`, {
    encoding: 'utf-8'
  });

  return {
    name,
    content: JSON.parse(schema),
    path: dir,
    fileName: `${formatName(name)}.json`
  };
};

const loadMetadata = async (path: string, docsDir: string, name: string) => {
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
    fileName: `${formatName(name)}.json`
  };
};

const loadMetadataAndSchema = async (hardocsJson: any) => {
  if (!hardocsJson.allDocsData) {
    console.log('No records');
    return hardocsJson;
  }

  for (const doc of hardocsJson.allDocsData) {
    if (doc.type === 'record') {
      const metadataContent = await fs.promises.readFile(doc.path, 'utf-8');
      const schemaContent = await fs.promises.readFile(
        doc.schema.path,
        'utf-8'
      );

      doc.content = metadataContent;
      doc.schema.content = schemaContent;
    }
  }

  return hardocsJson;
};

export default {
  loadSchema,
  bootstrapSchema,
  loadMetadata,
  schemaFromURL,
  processMetadata,
  loadMetadataAndSchema
};
