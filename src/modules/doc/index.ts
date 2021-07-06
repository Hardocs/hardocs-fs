import RefParser from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import fs from 'fs';
import { join } from 'path';
import { getHardocsDir } from '../../utils/constants';
import cwd from '../cwd';
import file from '../file';

const ajv = new Ajv();

const formatName = (name: string) =>
  name.split(' ').join('-').trim().toLowerCase();

// ✅
const processMetadata = async (data: any) => {
  const { path, docsDir, title, schemaUrl, schemaTitle } = data;

  let schemaName = schemaUrl.split('/');
  schemaName = schemaName[schemaName.length - 1].replace('.json', '');

  const metadata = {
    path: `${docsDir}/${formatName(title)}.json`,
    fileName: `${formatName(title)}.json`,
    title,
    type: 'record',
    schema: {
      source: schemaUrl,
      title: schemaTitle ?? null,
      name: schemaName,
      path: `.hardocs/${formatName(schemaTitle)}.json`,
      fileName: `${formatName(schemaTitle)}.json`
    }
  };
  const schema = await RefParser.dereference(schemaUrl);

  const valid = ajv.validate(schema, {});

  if (!valid) {
    throw new Error('Invalid schema');
  }

  await file.writeToFile({
    content: JSON.stringify(schema, null, 2),
    path: join(path, metadata.schema.path)
  });

  await file.writeToFile({
    content: JSON.stringify({}, null, 2),
    path: join(path, metadata.path)
  });
  return {
    ...metadata,
    content: {},
    schema: {
      ...metadata.schema,
      content: schema
    }
  };
};

// ✅
interface MetadataInput {
  title: string;
  schemaTitle?: string;
  schemaUrl: string;
  type: string;
}
const addMetadata = async (hardocsJson: any, input: MetadataInput) => {
  const { path, docsDir } = hardocsJson;
  const manifestPath = `${getHardocsDir(path)}/hardocs.json`;
  const manifest = JSON.parse(
    await fs.promises.readFile(manifestPath, 'utf-8')
  );

  const metadata = await processMetadata({ path, docsDir, ...input });
  if (!metadata) {
    return metadata;
  }
  const data = {
    path: metadata.path,
    fileName: metadata.fileName,
    title: metadata.title,
    type: metadata.type,
    schema: {
      path: metadata.schema.path,
      source: metadata.schema.source,
      fileName: metadata.schema.fileName
    }
  };

  const existing = manifest.hardocs.find(
    (d: any) => d.fileName === data.fileName
  );
  if (!existing) {
    manifest.hardocs.push(data);
    await file.writeToFile({
      path: manifestPath,
      content: JSON.stringify(manifest, null, 2)
    });
  }

  return metadata;
};
const processDoc = async (input: any) => {
  const { docsDir, title, path } = input;
  const manifestPath = `${getHardocsDir(path)}/hardocs.json`;
  const manifest = JSON.parse(
    await fs.promises.readFile(manifestPath, 'utf-8')
  );

  const doc = {
    path: `${docsDir}/${formatName(title)}.json`,
    fileName: `${formatName(title)}.json`,
    title,
    type: 'doc'
  };

  const existing = manifest.hardocs.find(
    (document: any) => document.fileName === doc.fileName
  );

  if (!existing) {
    manifest.hardocs.push(doc);

    await file.writeToFile({
      path: manifestPath,
      content: JSON.stringify(manifest, null, 2)
    });
  }
  return doc;
};

/**
 *
 * @param options Object with  `{
 *  path: string // should be a path
 * }`
 * @returns Json Schema Specification
 */
// ✅
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

// ✅
const loadMetadataAndSchema = async (hardocsJson: any, basePath: string) => {
  if (!hardocsJson.hardocs) {
    console.log('No records');
    return hardocsJson;
  }

  for (const doc of hardocsJson.hardocs) {
    if (doc.type === 'record') {
      const metadataContent = await fs.promises.readFile(
        join(basePath, doc.path),
        'utf-8'
      );
      const schemaContent = await fs.promises.readFile(
        join(basePath, doc.schema.path),
        'utf-8'
      );

      doc.content = metadataContent;
      doc.schema.content = schemaContent;
    }
  }

  return hardocsJson;
};

// ✅
const removeFromManifest = async (projectPath: string, filename: string) => {
  const manifestPath = `${projectPath}/.hardocs/hardocs.json`;

  const manifest = JSON.parse(
    await fs.promises.readFile(manifestPath, 'utf-8')
  );

  manifest.hardocs = manifest.hardocs.filter(
    (i: any) => i.fileName !== filename
  );

  await file.writeToFile({
    content: JSON.stringify(manifest, null, 2),
    path: manifestPath,
    fileName: manifest.name
  });
  return false;
};

export default {
  loadSchema,
  processMetadata,
  loadMetadataAndSchema,
  addMetadata,
  removeFromManifest,
  processDoc
};
