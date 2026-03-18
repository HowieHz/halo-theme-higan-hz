# Custom Color Schema Style Component

## Description

This component outputs the inline custom color schema style block for a single configured color schema.

## Usage

Body Content

```html
<th:block
  th:insert="~{components/custom-color-schema-style/template :: body(colorSchema=${colorSchema})}"
></th:block>
```
