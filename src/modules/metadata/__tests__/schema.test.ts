import {
  bootstrapSchema,
  generateMetadata,
  loadMetadata,
  loadSchema
} from '../';
import cwd from '../../cwd';
import { defaultStandard } from '../defaultStandard';

const path = process.cwd();
describe('Schema tests', () => {
  const mocksDir = __dirname + '/__mocks__';

  test('should load a schema', async () => {
    const schema = await loadSchema(`${mocksDir}/test-project/.hardocs`);

    // Default data should be same as generated schema
    expect(schema.content).toEqual(defaultStandard);
  });

  test('should update a schema standard', async () => {
    const response = await bootstrapSchema({
      path: `${mocksDir}/test-project/.hardocs`,
      content: defaultStandard
    });
    expect(JSON.parse(response)).toEqual(defaultStandard);
  });
  test('should generate an empty metadata file', async () => {
    await generateMetadata({
      path: `${mocksDir}/test-project`,
      docsDir: 'docs',
      content: {}
    });
  });
  test('should load metadata', async () => {
    await loadMetadata(`${mocksDir}/test-project`, 'docs');
  });
});

afterAll(async () => {
  await cwd.set(path);
});
