# Documentation Tools

This directory isolates dependency versions used by documentation tooling.

Currently, `vue-tsc` is not yet compatible with the TypeScript 7 version used by the project.
It therefore temporarily runs with TypeScript 6 for Vue and Markdown type checking of the documentation site,
while other project tools continue to use TypeScript 7.

Once `vue-tsc` supports TypeScript 7, this workaround should be removed and `vue-tsc` should be moved back to the root dependencies.

For the Chinese documentation, see [README.md](README.md).
