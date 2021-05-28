import metadata from '../';
import cwd from '../../cwd';
import project from '../../project';

const path = process.cwd();
describe('Schema tests', () => {
  const mocksDir = __dirname + '/__mocks__';

  // test('should load a schema', async () => {
  //   const schema = await metadata.loadSchema(
  //     'schema',
  //     `${mocksDir}/test-project/.hardocs`
  //   );

  //   // Default data should be same as generated schema
  //   expect(schema.content).toEqual(defaultStandard);
  // });

  // test('should update a schema standard', async () => {
  //   const response = await metadata.bootstrapSchema({
  //     path: `${mocksDir}/test-project/.hardocs`,
  //     content: defaultStandard
  //   });
  //   expect(response.content).toEqual(defaultStandard);
  // });
  // test('should generate an empty metadata file', async () => {
  //   await metadata.generateMetadata({
  //     path: `${mocksDir}/test-project`,
  //     docsDir: 'docs',
  //     label: 'default',
  //     schemaUrl: 'https://json.schemastore.org/esmrc.json'
  //   });
  //   // expect(response)
  // });

  test('load metadata and schema content', async () => {
    // const openedProject = await project.create({
    //   path: mocksDir,
    //   name: 'test-project',
    //   docsDir: 'docs'
    // });
    const openedProject = await project.open({
      path: `${mocksDir}/test-project`
    });

    const response = await metadata.loadMetadataAndSchema(openedProject);
    console.log(response.allDocsData);
  });

  // test('should generate and load a new metadata + schema', () => {

  // })

  // test('should load metadata', async () => {
  //   await metadata.loadMetadata(`${mocksDir}/test-project`, 'docs', 'schema');
  // });

  // test('should download schema from URL', async () => {
  //   const isWritten = await metadata.schemaFromURL(
  //     'https://json.schemastore.org/esmrc.json',
  //     'schema',
  //     `${mocksDir}/test-project/.hardocs`
  //   );

  //   expect(isWritten).toBeTruthy();
  // });
});

afterAll(async () => {
  await cwd.set(path);
});
