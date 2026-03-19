# Page Components

## Description

This directory contains the page-level runtime entry files and page-scoped styles used by Vite builds.

## Structure

- `shared`: Common runtime and styles that are intended to be loaded by all page components.
- `utils`: Optional utilities and styles that are imported only when a specific page needs them.
- `<page-name>`: The entry module and page-scoped styles for a specific page.

## Notes

- Put global page-component baseline files in `shared`, such as the shared runtime entry and always-on base styles.
- Put selective helpers in `utils`, such as TOC helpers, device helpers, and page-specific utility styles.
- Keep page-specific code inside its own page directory unless it is reused across multiple page components.
