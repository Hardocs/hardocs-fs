import cwd from '../';
const currentDir = process.cwd();
const newDir = '/home/divine/Desktop'; // FIXME: Modify this to your os 

describe('Current working Directory: -', () => {
  it('returns a path `string` to your current directory', () => {
    expect(cwd.get()).toBe(currentDir)
  });

  it("changes the current directory to path specified", async () => {
    await cwd.set(newDir)
    expect(currentDir).not.toBe(newDir)
  })

  it("new specified directory matches current directory", () => {
    expect(cwd.get()).toBe(newDir)
  })
});
