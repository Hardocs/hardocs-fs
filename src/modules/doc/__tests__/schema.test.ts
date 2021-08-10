import { join } from 'path';
import metadata from '..';
// import file from '../../file';
import project from '../../project';
import { defaultStandard } from '../defaultStandard';

const mocksDir = __dirname + '/__mocks__';
const projectName = 'test-project';
const title = 'esmrc';

const projectPath = join(mocksDir, projectName);
describe('Schema tests', () => {
  test('should load a schema', async () => {
    const schema = await metadata.loadSchema(
      'default-schema',
      `${projectPath}/.hardocs`
    );
    // Default data should be same as generated schema
    expect(schema.content).toEqual(defaultStandard);
  });
  test('load metadata and schema content', async () => {
    const openedProject = await project.open({
      path: projectPath
    });
    const response = await metadata.addMetadata(openedProject, {
      title,
      schemaTitle: title,
      schemaUrl: 'https://json.schemastore.org/esmrc.json'
    });

    expect(response.title).toEqual(title);
    expect(response.schema.title).toEqual(title);
  });
  test('should remove metadata from manifest', async () => {
    // await file.delete(join(projectPath, metadataPath));
    await metadata.removeFromManifest(projectPath, `${title}.json`);

    const openedProject: any = await project.open({
      path: projectPath
    });

    const exists = openedProject.hardocs.find((i: any) => i.title === title);

    expect(exists).toBeUndefined();
    expect(openedProject.error).toBeFalsy();
  });
  // test('should load metadata', async () => {
  //   await metadata.loadMetadata(projectPath, 'docs', 'schema');
  // });
});
