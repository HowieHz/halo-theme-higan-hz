# Layout Max Width Style Component

## Description

This component outputs the inline style block used to customize the shared layout max width.

## Usage

Body Content

```html
<th:block
  th:if="${theme.config?.styles?.is_max_width_settings}"
  th:insert="~{components/layout-max-width-style/template :: body}"
></th:block>
```
