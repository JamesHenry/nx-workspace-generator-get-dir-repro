import { strings } from '@angular-devkit/core';
import { normalizePath, Tree } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/tao/src/commands/ngcli-adapter';
import { join } from 'path';

interface Schema {
  name: string;
}

export default async function (tree: Tree, options: Schema) {
  const { name } = options;
  const sharedComponentsDir = 'shared/components';

  const nrwlAngularLib = wrapAngularDevkitSchematic('@nrwl/angular', 'lib');
  await nrwlAngularLib(tree, {
    name,
    directory: sharedComponentsDir,
    strict: true,
    linter: 'eslint',
    unitTestRunner: 'jest',
  });

  const createdProjectName = normalizePath(
    join(sharedComponentsDir, strings.dasherize(name))
  ).replace(/\//g, '-');

  const angularComponentGenerator = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'component'
  );
  await angularComponentGenerator(tree, {
    name,
    module: `${createdProjectName}.module.ts`,
    project: createdProjectName,
    style: 'scss',
    changeDetection: 'OnPush',
    displayBlock: true,
    export: true,
  });

  const storiesGenerator = wrapAngularDevkitSchematic(
    '@nrwl/angular',
    'stories'
  );
  await storiesGenerator(tree, {
    name: createdProjectName,
    generateCypressSpecs: false,
  });
}
