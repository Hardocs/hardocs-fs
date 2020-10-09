import path from 'path';
// import fs from 'fs';

import project from '../';
import mockData from './test.json';

let projectPath: string;

describe('Hardocs project test: ', () => {
  it('create a project and navigate to the new project directory', async () => {
    const _hardocsProject = (await project.create({
      name: 'test-project',
      path: path.join(process.cwd(), ''),
      docsDir: 'docs',
      entryFile: 'index.md'
    })) as HDS.IProject;

    projectPath = _hardocsProject.path as string;
    /**
     * The ID is a randomly generated string so i have to reasign it to a fixed value and also modify the mock to have an id of "1"
     */
    mockData.id = '1';
    _hardocsProject.id = '1';

    // fs.writeFileSync(
    //   path.join(__dirname, './test.json'),
    //   JSON.stringify(_hardocsProject)
    // );
    expect(_hardocsProject).toEqual(expect.objectContaining(mockData));
    /**
     * Clean-up
     *
     * Delete created hardocs project
     */
    // fs.rmdirSync(_hardocsProject.path as string, {
    //   recursive: true
    // });
  });

  it('opens a hardocs project', async () => {
    const _openedProject = (await project.open({
      path: projectPath
    })) as HDS.IProject;
    mockData.id = '1';
    _openedProject.id = '1';

    expect(_openedProject).toEqual(expect.objectContaining(mockData));
  });
});
