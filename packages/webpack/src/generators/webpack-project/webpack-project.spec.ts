import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { webpackProjectGenerator } from './webpack-project';

describe('webpackProject', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(tree, 'mypkg', {
      root: 'libs/mypkg',
      sourceRoot: 'libs/mypkg/src',
      targets: {},
    });
  });

  it('should generate files', async () => {
    await webpackProjectGenerator(tree, {
      project: 'mypkg',
    });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(project.targets).toMatchObject({
      build: {
        executor: '@nrwl/webpack:webpack',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          main: 'libs/mypkg/src/main.ts',
        },
      },
    });
  });

  it('should support --main option', async () => {
    await webpackProjectGenerator(tree, {
      project: 'mypkg',
      main: 'libs/mypkg/index.ts',
    });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(project.targets).toMatchObject({
      build: {
        executor: '@nrwl/webpack:webpack',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          main: 'libs/mypkg/index.ts',
        },
      },
    });
  });

  it('should support --tsConfig option', async () => {
    await webpackProjectGenerator(tree, {
      project: 'mypkg',
      tsConfig: 'libs/mypkg/tsconfig.custom.json',
    });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(project.targets).toMatchObject({
      build: {
        executor: '@nrwl/webpack:webpack',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          tsConfig: 'libs/mypkg/tsconfig.custom.json',
        },
      },
    });
  });

  it('should support --devServer option', async () => {
    await webpackProjectGenerator(tree, {
      project: 'mypkg',
      devServer: true,
    });

    const project = readProjectConfiguration(tree, 'mypkg');

    expect(project.targets).toMatchObject({
      serve: {
        executor: '@nrwl/webpack:dev-server',
        options: {
          buildTarget: 'mypkg:build',
        },
        configurations: {
          production: {
            buildTarget: `mypkg:build:production`,
          },
        },
      },
    });
  });
});
