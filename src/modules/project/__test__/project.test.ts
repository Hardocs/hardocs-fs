import project from '../';
import mockData from './__mocks__/test.json';

const projectPath: string = __dirname + '/__mocks__';
const projectName = 'test-project';
describe('Hardocs project test: ', () => {
  mockData.path = `${projectPath}/${projectName}`;
  it('create a project and navigate to the new project directory', async () => {
    const _hardocsProject = (await project.create({
      name: projectName,
      docsDir: 'docs',
      path: projectPath
    })) as HDS.IProject;

    /**
     * The ID is a randomly generated string so i have to reasign it to a fixed value and also modify the mock to have an id of "1"
     */

    /**
     * Ensure that the created project matches a valid hardocs project
     */
    expect(_hardocsProject).toMatchObject(mockData);
  });

  it('opens a hardocs project', async () => {
    const _openedProject = (await project.open({
      path: mockData.path,
      force: true
    })) as HDS.IProject;

    expect(_openedProject).toMatchObject(mockData);
  });

  // it('create a hardocs project from an existing folder', async () => {
  //   const _hardocsProject = (await project.createFromExisting({
  //     name: 'test-project',
  //     docsDir: 'docs',
  //     path: projectPath
  //   })) as HDS.IProject;

  //   /**
  //    * Ensure that the created project matches a valid hardocs project
  //    */
  //   expect(_hardocsProject).toMatchObject(mockData);
  // });

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
