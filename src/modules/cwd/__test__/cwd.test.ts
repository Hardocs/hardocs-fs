import cwd from '../';

describe('Current working Directory: -', () => {
  it('returns a path `string` to your current directory', () => {
    const currentDir = cwd.get();

    expect(currentDir).toBeTruthy();
  });
});
