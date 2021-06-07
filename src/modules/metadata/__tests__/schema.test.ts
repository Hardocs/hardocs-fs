import cwd from '../../cwd';

const path = process.cwd();
describe('Schema tests', () => {
  // const mocksDir = __dirname + '/__mocks__';
  // test('should load a schema', async () => {
  //   const schema = await metadata.loadSchema(
  //     'schema',
  //     `${mocksDir}/test-project/.hardocs`
  //   );
  //   // Default data should be same as generated schema
  //   expect(schema.content).toEqual(defaultStandard);
  // });
  // test('load metadata and schema content', async () => {
  //   // const openedProject = await project.create({
  //   //   path: mocksDir,
  //   //   name: 'test-project',
  //   //   docsDir: 'docs'
  //   // });
  //   const openedProject = await project.open({
  //     path: `${mocksDir}/test-project`
  //   });
  //   const response = await metadata.loadMetadataAndSchema(openedProject);
  //   console.log(response.hardocs);
  // });
  // test('should generate and load a new metadata + schema', () => {
  // })
  // test('should load metadata', async () => {
  //   await metadata.loadMetadata(`${mocksDir}/test-project`, 'docs', 'schema');
  // });
});

afterAll(async () => {
  await cwd.set(path);
});
