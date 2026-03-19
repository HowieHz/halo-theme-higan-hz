# Custom Color Schema Runtime Component

## Description

This component outputs the custom color schema runtime scripts used by the base layout.

## Usage

Head Content

```html
<th:block
  th:if="${color_schema == 'custom'
           or theme_dark == 'custom'
           or theme_light == 'custom'
           or theme_auto == 'custom'}"
  th:insert="~{components/custom-color-schema-runtime/template :: head}"
></th:block>
```
