# NxWorkspaceGeneratorGetDirRepro

Run:

```sh
npx nx workspace-generator shared-component-angular-lib foo
```

It will silently fail to generate the relevant story file for the newly generated project. As discussed with Jason on Slack, this is because the `@nrwl/angular:stories` schematic uses `tree.getDir()` internally and this has not been wrapped in `wrapAngularDevkitSchematic()`.
