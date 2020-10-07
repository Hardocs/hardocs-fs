import cwd from '../';

describe('Current working Directory: -', () => {
  it('returns a path `string` to your current directory', () => {
    const currentDir = process.cwd();

    expect(cwd.get()).toBe(currentDir)
  });
});
