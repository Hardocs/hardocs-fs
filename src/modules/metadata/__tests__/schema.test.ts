import { defaultStandard } from '../defaultStandard';
import { generateDefaultSchema, loadSchema, updateSchema } from '../';
import cwd from '../../cwd';
import fs from 'fs/promises';

const path = process.cwd();
describe('Schema tests', () => {
  const mocksDir = __dirname + '/__mocks__';
  test('should create a default schema', async () => {
    await generateDefaultSchema(`${mocksDir}/test-project`);

    const file = await fs.readFile(
      `${mocksDir}/test-project/.hardocs/schema.json`,
      'utf-8'
    );
    expect(file).toBe(JSON.stringify(defaultStandard, null, 2));
    expect(file).toBeTruthy();
  });

  test('should load a schema', async () => {
    const schema = await loadSchema(`${mocksDir}/test-project`);

    // Default data should be same as generated schema
    expect(schema).toBe(JSON.stringify(defaultStandard, null, 2));
  });

  test('should update a schema standard', async () => {
    const response = await updateSchema({
      path: `${mocksDir}/test-project/.hardocs`,
      content: {
        H1: 'world'
      }
    });
    expect(response).toStrictEqual(
      JSON.stringify(
        {
          H1: 'world'
        },
        null,
        2
      )
    );
  });
});

afterAll(async () => {
  await cwd.set(path);
});
