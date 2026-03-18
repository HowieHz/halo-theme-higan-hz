# Layout Table Bottom Border Style Component

## Description

This component outputs the inline style block used to customize the shared table bottom border width.

## Usage

Body Content

```html
<th:block
  th:if="${theme.config?.styles?.is_show_the_table_bottom_border}"
  th:insert="~{components/layout-table-bottom-border-style/template :: body}"
></th:block>
```
