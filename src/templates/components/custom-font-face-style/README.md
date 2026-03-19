# Custom Font Face Style Component

## Description

This component outputs the inline `@font-face` style block for custom font file configuration.

## Usage

Body Content

```html
<th:block
  th:if="${theme.config?.styles?.is_custom_font_files_enable}"
  th:insert="~{components/custom-font-face-style/template :: body}"
></th:block>
```
