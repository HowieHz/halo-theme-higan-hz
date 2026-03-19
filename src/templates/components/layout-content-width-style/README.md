# Layout Content Width Style Component

## Description

This component outputs the inline style block used to customize the shared layout content width.

## Usage

Body Content

```html
<th:block
  th:if="${theme.config?.styles?.is_content_width_style_settings}"
  th:insert="~{components/layout-content-width-style/template :: body}"
></th:block>
```
