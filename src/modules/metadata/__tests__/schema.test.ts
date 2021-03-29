import { generateDefaultSchema } from '../';
import cwd from '../../cwd';

const path = process.cwd();
describe('Schema tests', () => {
  test('should create a default schema', async () => {
    await generateDefaultSchema({
      schemaDir: `${__dirname}/test-project/.hardocs`
    });
  });
});

afterAll(async () => {
  await cwd.set(path);
});
