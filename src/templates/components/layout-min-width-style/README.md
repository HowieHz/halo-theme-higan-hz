# Layout Min Width Style Component

## Description

This component outputs the inline style block used to customize the shared layout minimum width.

## Usage

Body Content

```html
<th:block
  th:if="${theme.config?.styles?.is_min_width_settings}"
  th:insert="~{components/layout-min-width-style/template :: body}"
></th:block>
```
