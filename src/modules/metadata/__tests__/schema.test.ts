import { defaultData, generateDefaultSchema, loadSchema } from '../';
import cwd from '../../cwd';

const path = process.cwd();
describe('Schema tests', () => {
  test('should create a default schema', async () => {
    await generateDefaultSchema({
      schemaDir: `${__dirname}/test-project`
    });
  });

  test('should load a schema', async () => {
    const schema = await loadSchema({
      path: `${__dirname}/test-project`
    });

    // Default data should be same as generated schema
    expect(schema).toBe(JSON.stringify(defaultData, null, 2));
  });
});

afterAll(async () => {
  await cwd.set(path);
});
