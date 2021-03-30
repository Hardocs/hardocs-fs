import { defaultStandard } from '../defaultStandard';
import { generateDefaultSchema, loadSchema } from '../';
import cwd from '../../cwd';

const path = process.cwd();
describe('Schema tests', () => {
  const mocksDir = __dirname + '/__mocks__';
  test('should create a default schema', async () => {
    await generateDefaultSchema(`${mocksDir}/test-project`);
  });

  test('should load a schema', async () => {
    const schema = await loadSchema(`${mocksDir}/test-project`);

    // Default data should be same as generated schema
    expect(schema).toBe(JSON.stringify(defaultStandard, null, 2));
  });
});

afterAll(async () => {
  await cwd.set(path);
});
