import project from '../';
import mockData from './test.json';

let projectPath: string;
describe('Hardocs project test: ', () => {
  it('create a project and navigate to the new project directory', async () => {
    const _hardocsProject = (await project.create({
      name: 'test-project',
      docsDir: 'docs'
    })) as HDS.IProject;

    projectPath = _hardocsProject.path as string;

    console.log({ _hardocsProject });
    /**
     * The ID is a randomly generated string so i have to reasign it to a fixed value and also modify the mock to have an id of "1"
     */
    mockData.id = '1';
    _hardocsProject.id = '1';

    /**
     * Ensure that the created project matches a valid hardocs project
     */
    expect(_hardocsProject).toEqual(expect.objectContaining(mockData));

    /**
     * Ensure that the current working directory is equal to the project.path
     */
    expect(_hardocsProject.path).toEqual(process.cwd());
  });

  it('opens a hardocs project', async () => {
    const _openedProject = (await project.open({
      path: projectPath,
      force: true
    })) as HDS.IProject;
    mockData.id = '1';
    _openedProject.id = '1';

    expect(_openedProject).toEqual(expect.objectContaining(mockData));
  });

  it('create a hardocs project from an existing folder', async () => {
    const _hardocsProject = (await project.createFromExisting({
      name: 'test-project',
      docsDir: 'docs',
      path: projectPath
    })) as HDS.IProject;

    /**
     * The ID is a randomly generated string so i have to reasign it to a fixed value and also modify the mock to have an id of "1"
     */
    mockData.id = '1';
    _hardocsProject.id = '1';

    /**
     * Ensure that the created project matches a valid hardocs project
     */
    expect(_hardocsProject).toEqual(expect.objectContaining(mockData));

    /**
     * Ensure that the current working directory is equal to the project.path
     */
    expect(_hardocsProject.path).toEqual(process.cwd());
  });

  it('throws an error for invalid project', async () => {
    const response = await project.open({ path: __dirname });

    expect(response).toEqual(
      expect.objectContaining({
        error: true
        // message: 'Not a valid hardocs project'
      })
    );
  });
});
