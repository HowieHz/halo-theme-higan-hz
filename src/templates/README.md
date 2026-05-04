# Templates

## Description

This directory contains the template source files, runtime entries, shared global assets, and reusable import-only modules used by Vite builds.

## Structure

- `components`: Template component compile-entry modules declared in `rolldownOptions.input` and consumed via Thymeleaf fragment syntax.
- `css-components`: Reusable CSS partials that are imported by other stylesheets.
- `error`: Error-page templates and related assets.
- `global`: Global runtime entry and always-on baseline styles.
- `page-components`: Page-level runtime entry files and page-scoped styles.
- `public`: Static assets copied through the template build.
- `ts-components`: Reusable TypeScript modules imported by page entries or components.

## Notes

- Use `global` for the single global entry and its baseline styles.
- Use `page-components` only for page-specific entry code and styles.
- Use `css-components` for CSS building blocks that are composed via `@import`.
- Use `ts-components` for reusable TypeScript logic imported via `import`.
- Use `components` only for template component compile entries that are registered in `rolldownOptions.input` and referenced through Thymeleaf fragments.
