# Source

## Description

This directory contains the source files used by Vite builds.

## Structure

- `templates`: Template source files, compile-entry components, runtime modules, and static assets.
- `types`: TypeScript declaration files, including Vite client type declarations.

## Templates

- `components`: Template component compile-entry modules declared in `rolldownOptions.input` and consumed via Thymeleaf fragment syntax.
- `error`: Error-page templates and related assets.
- `_runtime`: Runtime entry files and reusable runtime-only modules, including global assets, page entries, scripts, and style partials.
- `public`: Static assets copied through the template build.

## Notes

- Use `templates/components` only for template component compile entries that are registered in `rolldownOptions.input` and referenced through Thymeleaf fragments.
- Use `templates/_runtime/global` for the single global runtime entry and always-on baseline styles.
- Use `templates/_runtime/pages` for page-specific runtime entry code and page-scoped styles.
- Use `templates/_runtime/styles` for reusable CSS building blocks that are composed via `@import`.
- Use `templates/_runtime/scripts` for reusable TypeScript runtime logic imported via `import`.
