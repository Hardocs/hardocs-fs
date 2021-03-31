import { defaultStandard } from '../defaultStandard';
import { bootstrapSchema, loadSchema } from '../';
import cwd from '../../cwd';

const path = process.cwd();
describe('Schema tests', () => {
  const mocksDir = __dirname + '/__mocks__';

  test('should load a schema', async () => {
    const schema = await loadSchema(`${mocksDir}/test-project`);

    // Default data should be same as generated schema
    expect(schema).toBe(JSON.stringify(defaultStandard, null, 2));
  });

  test('should update a schema standard', async () => {
    const response = await bootstrapSchema({
      path: `${mocksDir}/test-project/.hardocs`,
      content: defaultStandard
    });
    expect(JSON.parse(response)).toEqual(defaultStandard);
  });
});

afterAll(async () => {
  await cwd.set(path);
});
