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

const processMetadata = (
  hardocsJson: any,
  label: string,
  schemaSource: string
) => {
  const metadata = {
    path: `${hardocsJson.path}/${hardocsJson.name}/${
      hardocsJson.docsDir
    }/${formatName(label)}-metadata.json`,
    fileName: `${formatName(label)}-metadata.json`,
    title: label,
    type: 'record',
    schema: {
      source: schemaSource,
      path: `${getHardocsDir(
        `${hardocsJson.path}/${hardocsJson.name}`
      )}/${formatName(label)}-schema.json`,
      fileName: `${formatName(label)}-schema.json`
    }
  };
  if (!Array.isArray(hardocsJson.allDocsData)) {
    hardocsJson.allDocsData = [];
  }

  if (!hardocsJson.allDocsData) {
    hardocsJson.allDocsData.unshift(metadata);
    return { hardocsJson, metadata };
  } else {
    const exists = hardocsJson.allDocsData.find(
      (v: Record<string, unknown>) => v.title === label
    );

    if (!exists) {
      hardocsJson.allDocsData.unshift(metadata);
    }

    return { hardocsJson, metadata };
  }
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
      title
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

interface DefaultMetadataProps {
  path: string;
  docsDir: string;
  label: string;
  schemaUrl: string;
}

const generateMetadata = async (opts: DefaultMetadataProps) => {
  const { path, label = 'metadata', schemaUrl } = opts;
  try {
    const { hardocsJson, hardocsDir } = file.getHardocsJsonFile({ path });
    const schema = await RefParser.dereference(schemaUrl);

    if (!schema) {
      throw new Error('Invalid schema');
    }

    const response = processMetadata(hardocsJson, label, schemaUrl);

    const schemaPromise = file.writeToFile({
      content: JSON.stringify(schema, null, 2),
      path: hardocsDir,
      fileName: response.metadata.schema.fileName
    });

    const metadataPromise = file.writeToFile({
      content: JSON.stringify({}, null, 2),
      path: `${path}/${hardocsJson.docsDir}`,
      fileName: response.metadata.fileName
    });

    const hardocsJsonPromise = fs.promises.writeFile(
      `${hardocsDir}/hardocs.json`,
      JSON.stringify(response.hardocsJson, null, 2),
      'utf-8'
    );
    await Promise.all([hardocsJsonPromise, metadataPromise, schemaPromise]);

    return {
      hardocsJson: response.hardocsJson,
      metadata: response.metadata,
      schema: response.metadata.schema
    };
  } catch (err) {
    throw new Error(
      JSON.stringify(
        {
          path: 'generateMetadata',
          message: err.message
        },
        null,
        2
      )
    );
  }
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
  generateMetadata,
  loadMetadata,
  schemaFromURL,
  processMetadata,
  loadMetadataAndSchema
};
