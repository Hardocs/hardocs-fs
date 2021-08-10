import folder from '../';

describe('folder tests', () => {
  console.log = () => {};
  it('returns a json file', () => {
    const data = folder.readPackage(
      '/home/divine/Documents/projects/hardocs/hardocs-fs/test-project'
    );

    console.log(data);
  });

  it('returns true if a hardocs.json file is present in a directory', () => {
    const data = folder.isHardocsProject(
      '/home/divine/Documents/projects/hardocs/hardocs-fs/test-project'
    );

    console.log(data);
  });
});
