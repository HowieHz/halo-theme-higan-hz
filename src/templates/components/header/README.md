# Header Component

## Description

The page header (Header) component is responsible for displaying the site title/logo, navigation, on-site search, theme toggling,
and other global top-of-page interactive elements. It is typically injected into page templates as part of the layout.

## Usage

Included as a fragment in layout templates:

- Referenced in the layout file (example): [`components/base-layout/template :: html`](/src/templates/components/base-layout/template.html) passes the header as a parameter:

  ```html
  th:replace="~{components/base-layout/template :: html(..., header = ~{components/header/template :: body}, ...)}"
  ```

- Ensure the imported TypeScript includes `src/templates/components/header/index.ts`
