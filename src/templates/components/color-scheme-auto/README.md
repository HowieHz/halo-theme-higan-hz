# Auto Color Scheme Component

## Description

When `[data-color-scheme="auto"]` wraps the document, the component makes the browser derive `color-scheme` from the visitor's `prefers-color-scheme` setting.
It declares a base `color-scheme: normal` and then tightens to `only light` or `only dark` via the media queries defined in `styles.css`,
so the entire theme follows the system preference without forcing a fixed theme.

## Usage

Head Content (for including necessary styles)

```html
<th:block th:insert="~{components/color-scheme-auto/template :: head}"></th:block>
```
