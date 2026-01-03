# Light Color Scheme Component

## Description

Applying `[data-color-scheme="light"]` keeps `color-scheme: only light`, so even if the visitor prefers dark mode the browser will render the page with light-mode palettes.
This component is useful for areas that must stay bright (such as documentation snippets or marketing pages) while keeping the declaration close to the template markup.

## Usage

Head Content (for including necessary styles)

```html
<th:block th:insert="~{components/color-scheme-light/template :: headContent}"></th:block>
```
